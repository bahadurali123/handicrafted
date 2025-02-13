import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; // importing 'Readable' from 'stream'
import { Configuration } from '../config/env.config.js';

// ................................

//   Configure Cloudinary

// ................................
cloudinary.config({
    cloud_name: Configuration.cloudinaryName,
    api_key: Configuration.cloudinaryKey,
    api_secret: Configuration.cloudinarySecret,
    secure: true // Return "https" URLs by setting secure: true
});

// ................................

//   Upload File on Cloudinary

// ................................
const uploadOnCloudinary = async (file) => {
    return await new Promise((resolve, reject) => {
        const options = {
            folder: Configuration.cloudinaryFolder,
            resource_type: 'auto'
        };
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                //  Clean up file from memory after processing
                file = null; // Removes the file reference (clear buffer)
                if (error) {
                    console.log("Reject", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });

        // Convert buffer to a readable stream and pipe it to Cloudinary's upload stream
        const stream = Readable.from(file);
        stream.pipe(uploadStream);
    }).finally(() => {
        // Ensure memory cleanup happens, even in case of failure
        file = null;
    });
};

// ................................

//   Find File ID from Cloudinary

// ................................
function findFile(url) {
    // Extract the substring between the last slashe (/) two last coma (.) 
    const startIndex = url.lastIndexOf('/') + 1;
    const endIndex = url.lastIndexOf('.');
    const publicId = url.substring(startIndex, endIndex);
    return publicId;
};

// ................................

//   Update File from Cloudinary

// ................................
const updateCloudinaryFile = async (publicId, fileBuffer) => {
    return new Promise((resolve, reject) => {
        const options = {
            folder: Configuration.cloudinaryFolder,
            public_id: publicId, // Public ID of the existing file to update
            overwrite: true,     // Allow overwriting the existing file
            resource_type: 'auto'
        };

        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                console.error('Error updating file:', error);
                reject(error);
            } else {
                console.log("File successfully updated in Cloudinary", result.secure_url);
                resolve(result.secure_url);
            }
        });

        const stream = Readable.from(fileBuffer);
        stream.pipe(uploadStream);
    });
};

// ................................

//   Delete File from Cloudinary

// ................................
const deletefile = async (publicId) => {
    try {
        const File = await cloudinary
            .uploader
            .destroy(`${Configuration.cloudinaryFolder}/${publicId}`);

        return File;
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

// ................................

//   Delete video File from Cloudinary

// ................................
const deletevideo = async (publicId) => {
    try {
        const options = {
            // folder: 'handcrafted',
            folder: Configuration.cloudinaryFolder,
            resource_type: 'video'
        }
        const delFile = await cloudinary.uploader.destroy(publicId, options);
        return delFile;
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

// ................................

//   Upload Multiple Files on Cloudinary

// ................................
const multiUploadOnCloudinary = async (files) => {
    // files will be an array of file buffers
    return await Promise.all(
        files.map(file => {
            return new Promise((resolve, reject) => {
                const options = {
                    folder: Configuration.cloudinaryFolder,
                    resource_type: 'auto',
                };
                const uploadStream = cloudinary.uploader.upload_stream(
                    options,
                    (error, result) => {
                        // Clean up file from memory after processing
                        file = null; // Removes the file reference (clear buffer)

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                // Convert buffer to a readable stream and pipe it to Cloudinary's upload stream
                const stream = Readable.from(file); // Use file.buffer instead of file
                stream.pipe(uploadStream);
            }).finally(() => {
                // Ensure memory cleanup happens, even in case of failure
                file = null;
            });
        })
    );
};

// ................................

//   Find Multiple Files IDs from Cloudinary

// ................................
const findMultiFile = async (urls) => {
    return await Promise.all(
        urls.map((url) => {
            // Extract the substring between the last slashe (/) two last coma (.) 
            const startIndex = url.lastIndexOf('/') + 1;
            const endIndex = url.lastIndexOf('.');
            const publicId = url.substring(startIndex, endIndex);
            return publicId;
        })
    )
};

// ................................

//   Update Multiple Files from Cloudinary

// ................................
const updateMultiCloudinaryFiles = async (publicIds, fileBuffers) => {
    return await Promise.all(
        fileBuffers.map((file, index) => {
            const publicId = publicIds[index];
            return new Promise((resolve, reject) => {
                const options = {
                    folder: Configuration.cloudinaryFolder,
                    public_id: publicId, // Public ID of the existing file to update
                    overwrite: true,     // Allow overwriting the existing file
                    resource_type: 'auto'
                };

                const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                    if (error) {
                        console.error('Error updating file:', error);
                        reject(error);
                    } else {
                        console.log("File successfully updated in Cloudinary", result.secure_url);
                        resolve(result.secure_url);
                    }
                });

                const stream = Readable.from(file);
                stream.pipe(uploadStream);
            });
        })
    )
};

// ................................

//   Delete Multiple Files from Cloudinary

// ................................
const deleteMultiFiles = async (publicIds) => {
    try {
        return await Promise.all(
            publicIds.map((publicId) => {
                const File = cloudinary
                    .uploader
                    .destroy(`${Configuration.cloudinaryFolder}/${publicId}`);

                return File;
            })
        )
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

export {
    uploadOnCloudinary,
    multiUploadOnCloudinary,
    findFile,
    findMultiFile,
    updateCloudinaryFile,
    updateMultiCloudinaryFiles,
    deletefile,
    deleteMultiFiles,
    deletevideo,
}