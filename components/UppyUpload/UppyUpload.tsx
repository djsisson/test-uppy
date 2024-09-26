"use client";

import { Session } from "@supabase/supabase-js";
import Uppy, { Meta, UploadResult, UppyFile } from "@uppy/core";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { useEffect } from "react";

const supabaseUploadURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/upload/resumable`;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKETNAME = "test";

export const UppyUpload = ({ session }: { session: Session | null }) => {
  const uppy = new Uppy().use(Tus, {
    endpoint: supabaseUploadURL,
    headers: {
      authorization: `Bearer ${session?.access_token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    uploadDataDuringCreation: true,
    allowedMetaFields: [
      "bucketName",
      "objectName",
      "contentType",
      "cacheControl",
      "fileName",
    ],
    onError: function (error) {
      console.log("Failed because: " + error);
    },
  });

  useEffect(() => {
    const handleFileAdded = async (
      file: UppyFile<Meta, Record<string, never>>
    ) => {
      const fileName = crypto.randomUUID();
      const supabaseMetadata = {
        bucketName: BUCKETNAME,
        objectName: `folder/test/${fileName}`,
        contentType: file.type,
        fileName,
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };
    };

    const handleComplete = (
      result: UploadResult<Meta, Record<string, never>>
    ) => {
      console.log(result);
    };

    uppy.on("file-added", handleFileAdded);
    uppy.on("complete", handleComplete);

    return () => {
      uppy.off("file-added", handleFileAdded);
      uppy.off("complete", handleComplete);
    };
  }, []);

  return (
    <div className="w-full h-full my-4">
      <Dashboard
        proudlyDisplayPoweredByUppy={false}
        width={"100%"}
        height={"500px"}
        uppy={uppy}
      />
    </div>
  );
};
