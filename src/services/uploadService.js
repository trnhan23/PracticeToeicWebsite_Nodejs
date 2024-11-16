import cloudinary from '../config/cloudinaryConfig.js';

let uploadFile = async (fileData) => {
    if (!fileData) {
        throw new Error('Không tìm thấy tệp để upload.');
    }
    try {
        const uploadResult = await cloudinary.uploader.upload(fileData.path, {
            folder: 'uploads',
            resource_type: 'auto',
        });

        return uploadResult;
    } catch (error) {
        throw new Error('Upload lên Cloudinary thất bại: ' + error.message);
    }
};

module.exports = {
    uploadFile: uploadFile,
};
