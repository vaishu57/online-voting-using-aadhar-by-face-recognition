'use server';
/**
 * @fileOverview A flow for verifying if two faces match.
 *
 * - verifyFace - A function that compares a profile image with a live camera snapshot.
 * - VerifyFaceInput - The input type for the verifyFace function.
 * - VerifyFaceOutput - The return type for the verifyFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import fs from 'fs/promises';
import path from 'path';

const VerifyFaceInputSchema = z.object({
  profileImageUrl: z
    .string()
    .describe(
      "A public URL, a local path from the /public folder, or a Base64 data URI for the voter's profile image."
    ),
  liveImageDatUri: z
    .string()
    .describe(
      "A snapshot from the live camera feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyFaceInput = z.infer<typeof VerifyFaceInputSchema>;

const VerifyFaceOutputSchema = z.object({
  isMatch: z
    .boolean()
    .describe('Whether the person in the live snapshot is the same as the person in the profile image.'),
  reason: z.string().describe('A brief explanation for the decision.'),
});
export type VerifyFaceOutput = z.infer<typeof VerifyFaceOutputSchema>;

export async function verifyFace(input: VerifyFaceInput): Promise<VerifyFaceOutput> {
  return verifyFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyFacePrompt',
  input: {schema: VerifyFaceInputSchema},
  output: {schema: VerifyFaceOutputSchema},
  prompt: `You are a high-security AI facial verification system. Your only task is to determine if two images show the same person. You must be extremely strict and reject any ambiguity.

**Primary Directive: Reject Obstructions**

This is your most important rule. Before comparing faces, you MUST check if the live camera snapshot shows a clear, unobstructed view of the person's face.
*   **Is the face covered by hands, a mask, sunglasses, or any other object?**
*   **Is the face turned too far away from the camera?**
*   **Is the image too blurry or dark to see key features?**

If the answer to ANY of these questions is YES, you MUST immediately fail the verification.
*   Set \`isMatch: false\`.
*   Set the \`reason\` to "Face is obstructed or not clearly visible."

**Secondary Directive: Compare Core Facial Structure**

Only if the face in the live snapshot is completely clear and unobstructed, proceed with the comparison. Your decision must be based ONLY on the stable, geometric structure of the face.
*   **Eye Shape & Spacing:** The fundamental shape of the eyes and the distance between them.
*   **Nose Structure:** The underlying shape of the nose bridge and nostrils.
*   **Jawline and Chin Shape:** The overall contour of the lower face.

**What to IGNORE:**
*   Lighting differences.
*   Minor changes in camera angle.
*   Facial expression (smile vs. neutral).
*   Superficial changes like makeup or hairstyle.

**Decision Logic:**
1.  **Check for Obstructions First:** If the live photo is obstructed, FAIL. No further analysis is needed.
2.  **MATCH (\`isMatch: true\`):** If, and only if, the face is unobstructed AND the core facial geometry (eyes, nose, jawline) is undeniably consistent between the two images, you may return a match.
3.  **NO MATCH (\`isMatch: false\`):** If there is any structural difference that cannot be explained by minor angle or lighting changes, you must return a mismatch.

**Your default position is to be skeptical. Prioritize security over convenience. It is better to wrongly reject a real user than to wrongly accept an imposter.**

Provide a one-sentence reason for your decision.

Profile Picture: {{media url=profileImageUrl}}
Live Camera Snapshot: {{media url=liveImageDatUri}}`,
});

const verifyFaceFlow = ai.defineFlow(
  {
    name: 'verifyFaceFlow',
    inputSchema: VerifyFaceInputSchema,
    outputSchema: VerifyFaceOutputSchema,
  },
  async (input) => {
    let processedInput = { ...input };

    // If the profile image is a local path (starts with '/'), read it and convert to a data URI.
    // This allows the AI to process it without needing a public URL.
    if (processedInput.profileImageUrl.startsWith('/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', processedInput.profileImageUrl);
        const imageBuffer = await fs.readFile(imagePath);
        
        let mimeType = 'image/jpeg'; // Default MIME type
        const lowerCasePath = imagePath.toLowerCase();
        if (lowerCasePath.endsWith('.png')) {
          mimeType = 'image/png';
        } else if (lowerCasePath.endsWith('.gif')) {
          mimeType = 'image/gif';
        } else if (lowerCasePath.endsWith('.webp')) {
          mimeType = 'image/webp';
        } else if (lowerCasePath.endsWith('.jpg') || lowerCasePath.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
        }
        
        const base64Image = imageBuffer.toString('base64');
        processedInput.profileImageUrl = `data:${mimeType};base64,${base64Image}`;
      } catch (error) {
        console.error("Error reading local profile image:", error);
        return {
          isMatch: false,
          reason: `Could not read the profile image file at path: ${processedInput.profileImageUrl}. Ensure the file exists in the /public folder.`,
        };
      }
    }

    const {output} = await prompt(processedInput);
    return output!;
  }
);
