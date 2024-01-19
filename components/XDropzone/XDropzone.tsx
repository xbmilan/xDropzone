'use client'
/**
 * @package XDropzone
 * @description React component for file uploads using Mantine UI, Next.js 14, and Amazon AWS S3.
 * @version 1.0.0
 * @author Milan Thakur
 * @license MIT
 * @repository https://github.com/xbmilan/xDropzone
 *
 * @dependencies
 * - @mantine/core
 * - @tabler/icons-react
 * - @mantine/dropzone
 * - react
 *
 * @peerDependencies
 * - @mantine/notifications
 *
 * @exports
 * - XDropzone: React component for handling file uploads
 *
 * @requires
 * - './config/constant': Constants for accepted file types, messages, and file types.
 */

import React, { useEffect, useState } from 'react';
import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconCheck } from '@tabler/icons-react';
import { Dropzone, FileWithPath, FileRejection } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';

import '@mantine/dropzone/styles.css';

import { ACCEPTED_FILE_TYPES, MESSAGES } from './config/constant';

interface UploadResponse {
  status: boolean;
  uploadedUrl: string;
}

interface XDropzoneProps {
  // You can define props here if needed
}

const XDropzone: React.FC<XDropzoneProps> = () => {
  // State variables to manage uploaded URL, errors, and loading state
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle wrong file types and display error notifications
  const handleWrongFile = (fileError: FileRejection[]) => {
    const errorCode = fileError[0].errors[0].code;
    const message =
      errorCode === 'file-too-large'
        ? MESSAGES.WRONG_SIZE_MESSAGE
        : errorCode === 'file-type'
        ? MESSAGES.WRONG_FILE_MESSAGE
        : MESSAGES.SUCCESS_MESSAGE; // Default message if no match

    notifications.show({
      title: 'Error!',
      message: `${message}`,
      color: 'red',
      icon: <IconX stroke={1.5} />,
    });
  };

  // Effect hook to show success or error notifications based on uploadedUrl and error state
  useEffect(() => {
    setLoading(false);

    // Utility function to show notifications
    const showNotification = (title: string, message: string, color: string, icon: React.ReactNode) => {
      notifications.show({
        title,
        message,
        color,
        icon,
      });
    };

    if (!error && uploadedUrl !== '') {
      showNotification('Success!', MESSAGES.SUCCESS_MESSAGE, 'teal', <IconCheck stroke={1.5} />);
    } else if (error && uploadedUrl === '') {
      showNotification('Error!', MESSAGES.FAILED_MESSAGE, 'red', <IconX stroke={1.5} />);
    }
  }, [uploadedUrl, error]);

  // Function to upload files to Amazon S3
  const uploadFileS3 = async (files: FileWithPath[]) => {
    setLoading(true);
    try {
      const file = files?.[0]!;
      const res = await uploadMedia(file);
      setError(!res.status);
      setUploadedUrl(res.uploadedUrl);
    } catch (e) {
      setUploadedUrl('');
      setError(true);
    }
  };

  // Function to upload media to S3 and return the status and URL
  const uploadMedia = async (file: File): Promise<UploadResponse> => {
    try {
      // POST request to backend route handler
      const res = await fetch(`/api/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size }),
      });

      // Response includes a putUrl for upload and a getUrl for displaying a preview
      const { putUrl, getUrl } = await res.json();

      // Request made to putUrl, media file included in body
      const uploadResponse = await fetch(putUrl, {
        body: file,
        method: 'PUT',
        headers: { 'Content-Type': file.type },
      });

      return { status: uploadResponse.ok, uploadedUrl: getUrl };
    } catch (error) {
      setError(true);
      throw error;
    }
  };

  // JSX structure for the XDropzone component
  return (
    <Dropzone
      loading={loading}
      onDrop={uploadFileS3}
      onReject={handleWrongFile}
      maxSize={5 * 1024 ** 2}
      accept={ACCEPTED_FILE_TYPES}
      p="md"
    >
      <Group justify="center" gap="xl" mih={220} w={801} style={{ pointerEvents: 'none' }}>
        {/* Icons for different states of Dropzone */}
        <Dropzone.Accept>
          <IconUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
        </Dropzone.Idle>

        {/* Text content for the Dropzone component */}
        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default XDropzone;
