const express = require("express");
const router = express.Router();
const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("travell-app");

const File = require('../models/File')
const User = require('../models/User')

router.post("/upload", async (req, res) => {
  try {
    await processFile(req, res);
    if (!req.file) {
      return res
        .status(400)
        .send({ message: "Por favor, selecione uma imagem" });
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });
    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        try {
          File.create({userId: req.query.userId, url: publicUrl})
        } catch (error) {
          return res.status(500).send({
            message: `Algo deu errado ao relacionar arquivo ${url} ao usuário ${userId}` 
          })   
        }
        return res.status(500).send({
          message: `Upload do arquivo realizado com sucesso: ${req.file.originalname}, mas o acesso público foi negado`,
          url: publicUrl,
        });
      }
      try {
        File.create({userId: req.query.userId, url: publicUrl})
      } catch (error) {
        return res.status(500).send({
          message: `Algo deu errado ao relacionar arquivo ${url} ao usuário ${userId}` 
        })   
      }
      
      res.status(200).send({
        message:
          "Upload do arquivo realizado com sucesso: " + req.file.originalname,
        url: publicUrl,
      });
    });
    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "Arquivo deve ter no máximo 2MB",
      });
    }
    res.status(500).send({
      message: `Não foi possível fazer o upload do arquivo: ${req.file.originalname}. ${err}`,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });
    res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Não foi possível resgatar arquivos",
    });
  }
});

//Download do arquivo
/*router.get("/:name", async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    res.status(500).send({
      message: "Falha ao realizar download" + err,
    });
  }
});
*/

router.get("/user", async (req, res) => {
  const userId = req.params.id
  try {
    const files = await File.find({ user: userId })

    res.status(200).json(files)

} catch (error) {
    res.status(500).json({ erro: error })
}
})

router.get('/deleteAll', async(req, res) => {

  const files = await File.find()

  try {
      await File.deleteMany({ files })
      res.status(200).json({message: 'Todos os arquivos foram deletados.'})

  } catch (error) {
      res.status(500).json({ erro: error })
  }
})

module.exports = router;
