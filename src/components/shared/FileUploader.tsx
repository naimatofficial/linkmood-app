import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type FileUpoaderProps = {
	fieldChange: (FILES: File[]) => void;
	mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUpoaderProps) => {
	const [file, setFile] = useState<File[]>([]);
	const [fileURL, setFileURL] = useState(mediaUrl);

	const onDrop = useCallback(
		(acceptedFiles: FileWithPath[]) => {
			setFile(acceptedFiles);
			fieldChange(acceptedFiles);
			setFileURL(URL.createObjectURL(acceptedFiles[0]));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[file]
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".svg"],
		},
	});

	return (
		<div
			{...getRootProps()}
			className="flex-center flex-col bg-dark-3 rounded-xl cursor-pointer "
		>
			<input {...getInputProps()} className=" cursor-pointer" />
			{fileURL ? (
				<>
					<div className="flex flex-1 justify-center w-full p-5 lg:p-10">
						<img
							src={fileURL}
							alt="upload-photo"
							className="file_uploader-img"
						/>
					</div>
					<p className="file_uploader-label">Click or drag photo to replace</p>
				</>
			) : (
				<div className="file_uploader-box">
					<img
						src="/assets/icons/file-upload.svg"
						alt="file-upload"
						width={96}
						height={77}
					/>
					<h3 className="base-medium text-light-2 mb-2 mt-6">
						Drag photo here
					</h3>
					<p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
				</div>
			)}
		</div>
	);
};

export default FileUploader;
