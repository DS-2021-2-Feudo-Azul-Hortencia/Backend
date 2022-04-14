const express = require("express");
const router = express.Router();
// const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const util = require("util");
const multer = require("multer");
const File = require("../models/File");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCLOUD_STORAGE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_STORAGE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    ),
  },
});
const bucket = storage.bucket("travell-app");

const maxSize = 2 * 1024 * 1024;

let upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
});

router.post("/upload", upload.any(), async (req, res) => {
  try {
    const file = req.files[0];

    if (!file) {
      return res
        .status(400)
        .send({ message: "Por favor, selecione uma imagem" });
    }
    // Create a new blob in the bucket and upload the file data.

    const formatOriginalFilename =
      file.originalname.split(".")[0] +
      Math.random().toString(16).slice(2) +
      "." +
      file.originalname.split(".")[1];

    const blob = bucket.file(formatOriginalFilename);
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
        await bucket.file(formatOriginalFilename).makePublic();
      } catch {
        return res.status(500).send({
          message: `Upload do arquivo realizado com sucesso: ${file.originalname}, mas o acesso público foi negado`,
          url: publicUrl,
        });
      }
      res.status(200).send({
        message:
          "Upload do arquivo realizado com sucesso: " + file.originalname,
        url: publicUrl,
        fileName: file.originalname,
      });
    });
    blobStream.end(file.buffer);
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "Arquivo deve ter no máximo 2MB",
      });
    }

    console.log(err);
    res.status(500).send({
      message: `Não foi possível fazer o upload do arquivo. ${err}`,
    });
  }
});

router.post("/user", async (req, res) => {
  const { user, fileName, url } = req.body;

  try {
    await File.create({ user, fileName, url });

    res.status(200).json({ message: "Arquivo salvo com sucesso" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/user/all-files", async (req, res) => {
  const { id } = req.query;

  try {
    const files = await File.find({ user: id });

    res.status(200).json({ files });
  } catch (e) {
    res.status(500).json({ error: e.message });
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
