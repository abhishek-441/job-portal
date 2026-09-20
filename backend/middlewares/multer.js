import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");  // here the name "file" is used is same as the name file used in signup

// "singleUpload " is used at every place where we need to functionality of file uplaod