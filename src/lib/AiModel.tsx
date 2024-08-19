/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Reference to : {\n   "time": 1550476186479,\n   "blocks": [\n      {\n         "id": "oUq2g_tl8y",\n         "type": "header",\n         "data": {\n            "text": "Editor.js",\n            "level": 2\n         }\n      },\n      {\n         "id": "zbGZFPM-iI",\n         "type": "paragraph",\n         "data": {\n            "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."\n         }\n      },\n      {\n         "id": "qYIGsjS5rt",\n         "type": "header",\n         "data": {\n            "text": "Key features",\n            "level": 3\n         }\n      },\n      {\n         "id": "XV87kJS_H1",\n         "type": "list",\n         "data": {\n            "style": "unordered",\n            "items": [\n               "It is a block-styled editor",\n               "It returns clean data output in JSON",\n               "Designed to be extendable and pluggable with a simple API"\n            ]\n         }\n      },\n      {\n         "id": "AOulAjL8XM",\n         "type": "header",\n         "data": {\n            "text": "What does it mean «block-styled editor»",\n            "level": 3\n         }\n      },\n      {\n         "id": "cyZjplMOZ0",\n         "type": "paragraph",\n         "data": {\n            "text": "Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\\"cdx-marker\\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core."\n         }\n      }\n   ],\n   "version": "2.8.1"\n}',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "time": 1678873600000,\n  "blocks": [\n    {\n      "id": "grocery-list-header",\n      "type": "header",\n      "data": {\n        "text": "Grocery List",\n        "level": 2\n      }\n    },\n    {\n      "id": "grocery-list-instructions",\n      "type": "paragraph",\n      "data": {\n        "text": "Add your grocery items below.  Check off items as you buy them."\n      }\n    },\n    {\n      "id": "grocery-items-list",\n      "type": "checklist",\n      "data": {\n        "items": [\n          {\n            "text": "Milk",\n            "checked": false\n          },\n          {\n            "text": "Eggs",\n            "checked": false\n          },\n          {\n            "text": "Bread",\n            "checked": false\n          }\n        ]\n      }\n    }\n  ],\n  "version": "2.28.1"\n}\n```\n\n**Explanation:**\n\n* **`time`:** Timestamp for the editor data (optional).\n* **`blocks`:** An array containing the content of the editor.\n* **`grocery-list-header`:** \n    * `type: "header"`:  Defines a heading block.\n    * `data.text: "Grocery List"`: The text of the heading.\n    * `data.level: 2`:  Indicates a level 2 heading (a subheading).\n* **`grocery-list-instructions`:**\n    * `type: "paragraph"`: A standard paragraph block.\n    * `data.text`:  Provides instructions for the list.\n* **`grocery-items-list`:**\n    * `type: "checklist"`:  This is where the actual grocery items will be listed.\n    * `data.items`:  An array of items, each with:\n        * `text`: The item name.\n        * `checked`:  A boolean indicating whether the item has been checked off (defaults to `false`).\n\n**To Use This Template:**\n\n1. **Editor.js Setup:** Ensure you have Editor.js installed and set up on your website/app. \n2. **Custom Plugin:** You\'ll need a custom "Checklist" plugin for Editor.js to handle the checklist functionality.  There are existing plugins you can use as inspiration (search for "Editor.js checklist plugin").\n3. **Data Handling:**\n   * When the user edits the grocery items in the checklist, your code needs to save the updated `data.items` array (including checked statuses) to a database or local storage.\n   * When the user loads the list again, the data should be loaded back into the Editor.js instance.\n\n**Remember:**  This is a basic example. You can extend it to add:\n\n* **Adding new items:**  Allow users to type in new items and append them to the `data.items` array.\n* **Deleting items:**  Implement a way to delete items from the list.\n* **Sorting:**  Let users sort the list alphabetically or by category.\n* **More information per item:**  Add extra fields for each item (like quantity, price, etc.). \n',
        },
      ],
    },
  ],
});

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
