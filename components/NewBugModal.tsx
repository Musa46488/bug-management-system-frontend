"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Select, { MultiValue, StylesConfig } from "react-select";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

interface User {
  id: string;
  name: string;
  role: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const NewBugModal = ({
  creator_id,
  setIsModalOpen,
  projectId,
  onBugCreated,
}: {
  creator_id: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  onBugCreated: () => void;
}) => {
  const [bugTitle, setBugTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [developers, setDevelopers] = useState<User[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<SelectOption[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/role/developer`,
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

      setDevelopers(data);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeveloperChange = (options: MultiValue<SelectOption>) => {
    setSelectedDevelopers([...options]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("title", bugTitle);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("creator_id", creator_id);
    formData.append("project_id", projectId);
    formData.append("type", type);
    formData.append("status", status);

    selectedDevelopers.forEach((dev) =>
      formData.append("developerIds[]", dev.value),
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/bugs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      onBugCreated();
      setIsModalOpen(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const developerOptions = developers.map((developer) => ({
    value: developer.id,
    label: developer.name,
  }));

  const muiFieldSx = {
    "& .MuiOutlinedInput-root": {
      height: "50px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      "& fieldset": {
        borderColor: "#d1d5db",
      },
      "&:hover fieldset": {
        borderColor: "#2979ff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2979ff",
        borderWidth: "1px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "14px",
    },
  };

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
      <div className="bg-white p-5 rounded-lg max-w-207.5 sm:max-h-162.5 w-full h-full shadow-[0_4px_8px_rgba(0,0,0,0.1)] z-1000 flex flex-col-reverse sm:flex-row">
        <div className="max-w-111.5 w-full h-full">
          <p className="text-black font-medium text-xl mb-7.5">Add New Bug</p>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Bug Title"
                variant="outlined"
                fullWidth
                required
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                sx={muiFieldSx}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  ...muiFieldSx,
                  "& .MuiOutlinedInput-root": {
                    ...muiFieldSx["& .MuiOutlinedInput-root"],
                    height: "auto",
                  },
                }}
              />
              <TextField
                label="Deadline"
                type="date"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                sx={muiFieldSx}
              />
              <TextField
                select
                label="Bug Type"
                fullWidth
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={muiFieldSx}
              >
                <MenuItem value="bug">Bug</MenuItem>
                <MenuItem value="feature">Feature</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                fullWidth
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={muiFieldSx}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="started">Started</MenuItem>
              </TextField>
              <div>
                <label className="font-normal text-base text-black mb-2.5">
                  Assign Developers
                </label>
                <Select
                  isMulti
                  required
                  value={selectedDevelopers}
                  onChange={handleDeveloperChange}
                  options={developerOptions}
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
            </Stack>
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

export default NewBugModal;
