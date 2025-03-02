"use client";

import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface FileDropzone {
    className?: string;
    files: File[];
    changeHandler?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FileDropzone(props: FileDropzone) {
    return (
        <div className={ twMerge("w-140 h-140", props.className) }>
            <label className="flex flex-col items-center justify-center w-full h-full relative border-2 border-gray-400 border-dashed rounded-lg bg-gray-100 hover:bg-gray-200">
                <input className="w-full h-full absolute border opacity-0 cursor-pointer" type="file" accept="image/jpeg, image/jpg, image/png" name="image" multiple={true} required={true} onChange={props.changeHandler}/>
                <div className="flex flex-col items-center justify-center pt-5 pb-4">
                    <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload a photo</span> or
                        drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
                </div>
                <p>{props.files.map(file =>
                    <span className="text-sm text-gray-600" key={file.lastModified}>{file.name}<br/></span>)}
                </p>
            </label>
        </div>
    );
}