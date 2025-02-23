import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "../../hooks/use-toast";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import AssignEditor from "./AssignEditor";
import { cn } from "@/lib/utils";

const FormPage = ({ onClose, onVideoSubmit }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inPlaylist: false,
    assignEditor: false,
    video: null,
    thumbnail: null,
    shortDescription: "",
  });

  // ... existing code ...

const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    const formDataToSend = new FormData();
    
    // Append all form fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('shortDescription', formData.shortDescription);
    
    // Append files with correct field names
    if (formData.video) {
      formDataToSend.append('videofile', formData.video);
    }
    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }
    
    if (selectedEditor) {
      formDataToSend.append('editorId', selectedEditor);
    }

    const response = await axios.post(
      'http://localhost:3000/api/creator/creator-upload-video',
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true // Important: This ensures cookies are sent with the request
      }
    );

    toast({
      title: "Success!",
      description: "Video uploaded successfully",
      variant: "default",
    });

    // Call the callback to update parent component
    if (onVideoSubmit) {
      onVideoSubmit(response.data);
    }

    onClose();
  } catch (error) {
    console.error('Upload error:', error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to upload video",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  // Mock editors data
  const editors = [
    { id: 1, name: "Alex Thompson", speciality: "Tech Reviews" },
    { id: 2, name: "Sarah Chen", speciality: "Gaming" },
    { id: 3, name: "Mike Johnson", speciality: "Lifestyle" },
    { id: 4, name: "Emma Davis", speciality: "Educational" },
  ];

  const steps = [
    { number: 1, title: "Basic Info", description: "Enter video details" },
    { number: 2, title: "Media Upload", description: "Upload your content" },
    { number: 3, title: "Editor", description: "Choose your editor" },
    { number: 4, title: "Review", description: "Verify details" },
  ];

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.title} className="md:flex-1">
              <div className="group flex flex-col border-l-4 border-zinc-800 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-zinc-400">
                  Step {step.number}
                </span>
                <span className="text-base font-semibold">
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      currentStep >= step.number
                        ? "text-white"
                        : "text-zinc-500"
                    )}
                  >
                    {step.title}
                    {currentStep > step.number && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </span>
                <span className="text-sm text-zinc-500">
                  {step.description}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="space-y-6">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="title" className="text-zinc-400">
            Video Title
          </Label>{" "}
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter video title"
            className="bg-gradient-to-b from-zinc-900 to-zinc-800 border-zinc-700 focus:border-zinc-500"
          />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="description" className="text-zinc-400">
            Description
          </Label>{" "}
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter video description"
            className="h-32 bg-gradient-to-b from-zinc-900 to-zinc-800 border-zinc-700 focus:border-zinc-500"
          />{" "}
        </div>{" "}
        
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="space-y-6">
        {" "}
        <div className="space-y-4">
          {" "}
          <div className="space-y-2">
            {" "}
            <Label className="text-zinc-400">Upload Video</Label>{" "}
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 bg-gradient-to-b from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 transition-all duration-300">
              {" "}
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video")}
                className="hidden"
                id="video-upload"
              />{" "}
              <Label
                htmlFor="video-upload"
                className="cursor-pointer block text-center"
              >
                {" "}
                <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-400" />{" "}
                <p className="text-zinc-400 mb-2">
                  Click to upload or drag and drop
                </p>{" "}
                <p className="text-sm text-zinc-500">
                  MP4, MOV, or WebM (max 800MB)
                </p>{" "}
              </Label>{" "}
            </div>{" "}
            {formData.video && (
              <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center justify-between">
                {" "}
                <span className="text-zinc-400 text-sm">
                  {formData.video.name}
                </span>{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, video: null }))
                  }
                >
                  {" "}
                  <X className="h-4 w-4" />{" "}
                </Button>{" "}
              </div>
            )}{" "}
          </div>{" "}
          <Separator className="my-6 bg-zinc-800" />{" "}
          <div className="space-y-2">
            {" "}
            <Label className="text-zinc-400">Upload Thumbnail</Label>{" "}
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 bg-gradient-to-b from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 transition-all duration-300">
              {" "}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "thumbnail")}
                className="hidden"
                id="thumbnail-upload"
              />{" "}
              <Label
                htmlFor="thumbnail-upload"
                className="cursor-pointer block text-center"
              >
                {" "}
                <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-400" />{" "}
                <p className="text-zinc-400 mb-2">
                  Click to upload or drag and drop
                </p>{" "}
                <p className="text-sm text-zinc-500">
                  PNG, JPG, or WebP (max 5MB)
                </p>{" "}
              </Label>{" "}
            </div>{" "}
            {formData.thumbnail && (
              <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center justify-between">
                {" "}
                <span className="text-zinc-400 text-sm">
                  {formData.thumbnail.name}
                </span>{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, thumbnail: null }))
                  }
                >
                  {" "}
                  <X className="h-4 w-4" />{" "}
                </Button>{" "}
              </div>
            )}{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="shortDescription" className="text-zinc-400">
              Short Description
            </Label>{" "}
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Enter a brief description"
              className="h-24 bg-gradient-to-b from-zinc-900 to-zinc-800 border-zinc-700 focus:border-zinc-500"
              maxLength={400}
            />{" "}
            <div className="text-right text-sm text-zinc-500">
              {" "}
              {formData.shortDescription.length}/400 characters{" "}
            </div>{" "}
          </div>{" "}
          
        </div>{" "}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 bg-zinc-900/50 p-4 rounded-lg mb-6">
          <Checkbox
            id="assignEditor"
            checked={formData.assignEditor}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({ ...prev, assignEditor: checked }));
              if (!checked) setSelectedEditor(null);
            }}
          />
          <Label htmlFor="assignEditor" className="text-zinc-400">
            Assign an editor to this video
          </Label>
        </div>

        {formData.assignEditor && (
          <AssignEditor
            selectedEditor={selectedEditor}
            setSelectedEditor={setSelectedEditor}
          />
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Video Summary</h3>
        <div className="space-y-4">
          {[
            { label: "Title", value: formData.title },
            { label: "Description", value: formData.description },
            { label: "In Playlist", value: formData.inPlaylist ? "Yes" : "No" },
            {
              label: "Video File",
              value: formData.video?.name || "Not uploaded",
            },
            {
              label: "Video Size",
              value: formData.video?.size
                ? `${(formData.video.size / (1024 * 1024)).toFixed(2)} MB`
                : "N/A",
            },
            {
              label: "Thumbnail",
              value: formData.thumbnail?.name || "Not uploaded",
            },
            {
              label: "Editor Assigned",
              value: formData.assignEditor
                ? editors.find((e) => e.id === selectedEditor)?.name || "None"
                : "No editor requested",
            },
          ].map((item, index) => (
            <div key={index} className="bg-zinc-900/50 p-4 rounded-lg">
              <span className="text-zinc-400">{item.label}: </span>
              <span className="text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gradient-to-br from-zinc-950 to-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-6">
          <CardTitle className="text-white">Upload Video</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <StepIndicator />

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1 || isSubmitting}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentStep === 4) {
                  handleSubmit();
                } else {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500"
            >
              {currentStep === 4 ? (
                isSubmitting ? (
                  "Uploading..."
                ) : (
                  "Submit"
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormPage;