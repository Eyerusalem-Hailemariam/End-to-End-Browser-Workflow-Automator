import path from 'path';
import { promises as fs } from 'fs';

/*
    This API route is responsible for handling the POST requests to generate a detailed description of the JSON interaction data.
    It reads the test.json file from the public folder, prepares the request payload for the Gemini API, and makes a POST request.
    The response from the Gemini API is then parsed and returned as the API response.
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Load the test.json file from the public folder
      const filePath = path.join(process.cwd(), 'public', 'test.json');
      const fileData = await fs.readFile(filePath, 'utf8');
      const interactions = JSON.parse(fileData); // Parse the JSON data

      // Prepare the request payload for the Gemini API
      const jsonData = {
        contents: [
          {
            parts: [
              {
                text: `Given the following JSON interaction data for web automation, provide a detailed step-by-step description of its functionality. Focus on explaining how each interaction with the web browser is structured, what elements are targeted, and what actions are performed. Your description should detail each step's type (e.g., click, input text), the selectors used to identify web elements, and any text or commands executed.\n\nInput JSON interaction data:\n\n${JSON.stringify(interactions)}\n\nTranslate the JSON data into a structured description that breaks down the process into identifiable actions like clicking buttons, entering text, and navigating through web pages. Here's what to include:\n\n1. Detail the purpose of each action (e.g., submit a form, enter details in a form field).\n2. Explain how each web element is located (e.g., CSS selector, ID, XPath).\n3. Describe the interactions performed on these elements (e.g., clicking a button, entering text).\n4. If applicable, mention any dynamic interactions based on external data inputs.\n5. Highlight any conditional logic or looping mechanisms used to handle repetitive actions or multiple data entries.\n6. Conclude with any final actions or submissions that complete the user's tasks on the page.\n\nYour detailed explanation will guide the accurate transformation of this JSON into Python code using Selenium, ensuring all functionalities are preserved and appropriately adapted. The description should be clear and concise, providing a blueprint for scripting complex web automation tasks.\n\nExample of expected description format:\n\n1. Identify and click the 'Submit' button using its CSS selector.\n2. Locate the 'Name' input field by its CSS selector and input the text 'John Doe'.\n3. Click the 'Confirm' button to finalize the entry, located using its specific CSS selector.\n\nThis description is crucial for accurately scripting the actions in a web automation framework like Selenium, ensuring the automation script effectively replicates the intended browser interactions.`
              }
            ]
          }
        ]
      };

      // Make a POST request to the Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from Gemini API:', JSON.stringify(errorData, null, 2));
        return res.status(500).json({ error: errorData });
      }

      // Parse and return the successful response
      const responseData = await response.json();
      return res.status(200).json(responseData);

    } catch (error) {
      console.error('Error in API handler:', error.message);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
