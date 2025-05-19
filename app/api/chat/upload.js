import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const form = new formidable.IncomingForm({ uploadDir: './public/uploads', keepExtensions: true});

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({message: 'Upload failed'});
        }

        console.log(files);
        return res.status(200).json({message: 'File uploaded'})
    });
}