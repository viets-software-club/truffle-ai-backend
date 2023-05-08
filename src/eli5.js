require("dotenv").config();



/*
This is a HTTP request send using the fetch module which is build into nodejs (>=18.00.00)
The current Method uses the gpt-3-turbo model to analyze a given read me file and to sum it up 
in a few words. This model requires different roles as it normally works with virtual 
dialoges. In my case I gpt to act like a teacher. The response of the POST request 
contains the answer which is later console.loged
*/

openAIRequestTurbo()
async function openAIRequestTurbo() { //here we would add a parameter. But I think it is easier to change later on
  const question =
    "The following text describes a prorgamming project that is current in development. Explain to me what the project is trying to archieve without telling me" +
    "how they are doing so. Please use arround 50 words and do not get tot technical"
  //  +readME;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,//Here we need a .env file where we write the openai_api_key in
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a Computer Science Teacher talking to his students and the students do not have a deep technical understanding. So the teacher tries to stay simple",
        },
        {
          role: "user",
          content: question,
        },
      ],
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  console.log(content);
  
}

