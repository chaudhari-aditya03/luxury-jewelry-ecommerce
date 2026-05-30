package com.jewelryshop.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jewelryshop.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadServiceImpl implements FileUploadService {

    private final Cloudinary cloudinary;

    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"};
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            log.info("Starting file upload to Cloudinary. Original filename: {}", file.getOriginalFilename());

            validateFile(file);

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "jewelry_shop/products",
                    "resource_type", "auto"
            ));

            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("File uploaded successfully to Cloudinary: {}", secureUrl);

            return secureUrl;

        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during Cloudinary upload: {}", e.getMessage(), e);
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty()) {
                return;
            }

            if (fileUrl.contains("cloudinary.com")) {
                String publicId = extractPublicId(fileUrl);
                if (publicId != null) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    log.info("File deleted successfully from Cloudinary: {}", publicId);
                }
            }
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary: {}", e.getMessage());
        }
    }

    private String extractPublicId(String fileUrl) {
        try {
            int lastDot = fileUrl.lastIndexOf(".");
            int folderStart = fileUrl.indexOf("jewelry_shop");

            if (folderStart != -1) {
                return fileUrl.substring(folderStart, lastDot);
            }

            int lastSlash = fileUrl.lastIndexOf("/");
            return fileUrl.substring(lastSlash + 1, lastDot);

        } catch (Exception e) {
            log.warn("Could not extract public_id from URL: {}", fileUrl);
            return null;
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }

        String fileExtension = getFileExtension(file.getOriginalFilename());

        boolean isAllowed = false;
        for (String ext : ALLOWED_EXTENSIONS) {
            if (ext.equalsIgnoreCase(fileExtension)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new RuntimeException("File type not allowed. Only image files are accepted");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}