import uploadService from '../services/uploadService.js';

let handleUploadFileToCloud = async (req, res) => {
    try {
        const fileData = req.file;

        if (!fileData) {
            return res.status(400).json({
                success: false,
                message: 'Không có tệp nào được upload.',
            });
        }

        const result = await uploadService.uploadFile(fileData);
        res.status(200).json({
            success: true,
            fileUrl: result.secure_url,
            message: 'Upload thành công!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Upload thất bại',
            error: error.message,
        });
    }
};

module.exports = {
    handleUploadFileToCloud: handleUploadFileToCloud,
};
