require('dotenv').config();

const express = require('express');
const axios = require('axios');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function markdownToPlainText(markdown) {
    //TODO: Refactor to another file
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]*?)\]\([^)]*?\)/g, '$1') // Replace links with their text
      .replace(/[_*~]/g, '') // Remove formatting characters
      .replace(/#{1,6}\s/g, '') // Remove header symbols
      .replace(/`{1,3}/g, '') // Remove inline code and code blocks
      .replace(/\n\s{2,}/g, '\n') // Remove multiple spaces after a line break
      .replace(/^-{3,}/g, ''); // Remove horizontal rules
  }

app.get('/tips', async (req, res) => {

    try {
            const repoOwner = 'girldevelopit'; // Replace with your GitHub repo owner
            const repoName = 'tips-for-new-coders'; // Replace with your GitHub repo name
            const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
        
            const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                },
            });
        
            const mdFiles = response.data.filter(file => file.name.endsWith('.md'));
            if (mdFiles.length === 0) {
                res.json({
                    response_type: 'ephemeral',
                    text: 'No markdown files found in the repo.',
                });
                return;
            }
        
            const randomFile = mdFiles[Math.floor(Math.random() * mdFiles.length)];
            const fileContentResponse = await axios.get(randomFile.download_url);
            const plainTextContent = markdownToPlainText(fileContentResponse.data);
        
            res.json({
              response_type: 'in_channel',
              text: `Here is a random markdown file from the repository: *${randomFile.name}* \n\n${plainTextContent}`,
              mrkdwn: true,
            });
        
          } catch (error) {                
                console.error(error);
                res.status(500).json({
                response_type: 'ephemeral',
                text: 'An error occurred while fetching the markdown files.',
            });
        }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`));