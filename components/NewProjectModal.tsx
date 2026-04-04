"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Select, { MultiValue, StylesConfig } from "react-select";

interface User {
  id: string;
  name: string;
  role: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const NewProjectModal = ({
  manager_id,
  setIsModalOpen,
  onProjectCreated,
}: {
  manager_id: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProjectCreated: () => void;
}) => {
  const [projectName, setProjectName] = useState("");
  const [detail, setDetail] = useState("");
  const [developers, setDevelopers] = useState<User[]>([]);
  const [QAs, setQAs] = useState<User[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<SelectOption[]>(
    [],
  );
  const [selectedQAs, setSelectedQAs] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers("developer");
    fetchUsers("QA");
  }, []);

  const fetchUsers = async (role: string) => {
    setIsLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/role/${role}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const { data } = await response.json();
      if (role === "developer") {
        setDevelopers(data);
      } else if (role === "QA") {
        setQAs(data);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("name", projectName);
    formData.append("short_detail", detail);
    formData.append("manager_id", manager_id);

    selectedDevelopers.forEach((dev) =>
      formData.append("developerIds[]", dev.value),
    );

    selectedQAs.forEach((qa) => formData.append("QAIds[]", qa.value));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      onProjectCreated();
      setIsModalOpen(false);
    } catch {
      setError("Network error");
    }
  };

  const handleDeveloperChange = (options: MultiValue<SelectOption>) => {
    setSelectedDevelopers([...options]);
  };

  const handleQAChange = (options: MultiValue<SelectOption>) => {
    setSelectedQAs([...options]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const developerOptions = developers.map((developer) => ({
    value: developer.id,
    label: developer.name,
  }));

  const qaOptions = QAs.map((QA) => ({
    value: QA.id,
    label: QA.name,
  }));

  const customSelectStyles: StylesConfig<
    { value: string; label: string },
    true
  > = {
    control: (base, state) => ({
      ...base,
      width: "100%",
      minHeight: "50px",
      borderColor: "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #2979ff" : "none",
      backgroundColor: "#fff",
      "&:hover": {
        borderColor: "#2979ff",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      height: "50px",
      padding: "0 15px",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "50px",
    }),
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-999 bg-black/50">
      <div className="bg-white p-5 rounded-lg max-w-207.5 sm:max-h-140 w-full h-full shadow-[0_4px_8px_rgba(0,0,0,0.1)] z-1000 flex flex-col-reverse sm:flex-row">
        <div className="max-w-111.5 w-full h-full">
          <p className="text-black font-medium text-xl mb-7.5">
            Add new Project
          </p>
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <div className="mb-2.5 flex flex-col">
              <label className="font-normal text-base text-black mb-2.5">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter project name"
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full h-12.5 p-3.75 outline-none border-2 border-[#F4F4F5] focus:border-[#2979ff]"
              />
            </div>
            <div className="mb-2.5 flex flex-col">
              <label className="font-normal text-base text-black mb-2.5">
                Short details
              </label>
              <input
                type="text"
                name="short_detail"
                placeholder="Enter details here"
                onChange={(e) => setDetail(e.target.value)}
                required
                className="w-full h-12.5 p-3.75 outline-none border-2 border-[#F4F4F5] focus:border-[#2979ff]"
              />
            </div>
            <div className="mb-2.5 flex flex-col">
              <label className="font-normal text-base text-black mb-2.5">
                Assign Developer
              </label>
              <Select
                isMulti
                required
                value={selectedDevelopers}
                onChange={handleDeveloperChange}
                options={developerOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customSelectStyles}
              />
            </div>
            <div className="mb-2.5 flex flex-col">
              <label className="font-normal text-base text-black mb-2.5">
                Assign QA
              </label>
              <Select
                isMulti
                required
                value={selectedQAs}
                onChange={handleQAChange}
                options={qaOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customSelectStyles}
              />
            </div>
            <div className="flex w-full h-12.5 gap-1.25 mt-2.5">
              <button
                type="submit"
                className="h-full w-1/2 rounded-[5px] bg-[#007dfa] text-white text-lg hover:bg-[#0071db]"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="h-full w-1/2 rounded-[5px] bg-white text-black text-lg shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:bg-[#d4d4d8]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col h-full w-full sm:w-4/5 items-center justify-center p-7.5">
          <div className="max-w-47.75 max-h-47 w-full h-full bg-[#fafbfc] rounded-xl flex flex-col items-center justify-center relative">
            <Image
              src="/images/gallery-add.png"
              alt="Icon"
              width={53}
              height={53}
            />
            <label className="mt-5 text-base text-[#4c535f]">Upload logo</label>
            <input
              type="file"
              accept="image/*"
              className="opacity-0 absolute w-full h-full cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
          </div>
          {imageFile && (
            <div className="mt-3 flex flex-col items-center gap-1.5">
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="object-cover rounded-lg"
                />
              )}
              <p className="text-xs text-[#666]">{imageFile.name}</p>
            </div>
          )}
          {error && (
            <div className="text-[#d9534f] bg-[#f8d7da] border border-[#f5c6cb] p-2.5 rounded-[5px] mt-3.75 text-sm font-bold text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
