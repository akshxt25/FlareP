import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';

const FormPage = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inPlaylist: false,
    useEditor: false,
    video: null,
    thumbnail: null,
    shortDescription: ''
  });

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Media Upload" },
    { number: 3, title: "Review" }
  ];

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <Progress value={(currentStep / 3) * 100} className="mb-4" />
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                ${currentStep > step.number ? 'bg-zinc-700 text-white' : 
                  currentStep === step.number ? 'bg-gradient-to-br from-zinc-700 to-zinc-900 text-white' : 
                  'bg-zinc-900 text-zinc-400'}`}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span className={`text-sm ${currentStep === step.number ? 'text-white' : 'text-zinc-400'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-zinc-400">Video Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter video title"
          className="bg-gradient-to-b from-zinc-900 to-zinc-800 border-zinc-700 focus:border-zinc-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-zinc-400">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter video description"
          className="h-32 bg-gradient-to-b from-zinc-900 to-zinc-800 border-zinc-700 focus:border-zinc-500"
        />
      </div>

      <div className="flex items-center space-x-2 bg-zinc-900/50 p-4 rounded-lg">
        <Checkbox
          id="playlist"
          checked={formData.inPlaylist}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inPlaylist: checked }))}
        />
        <Label htmlFor="playlist" className="text-zinc-400">Add to playlist</Label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-400">Upload Video</Label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 bg-gradient-to-b from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 transition-all duration-300">
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="hidden"
              id="video-upload"
            />
            <Label htmlFor="video-upload" className="cursor-pointer block text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
              <p className="text-zinc-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-zinc-500">MP4, MOV, or WebM (max 800MB)</p>
            </Label>
          </div>
          {formData.video && (
            <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-zinc-400 text-sm">{formData.video.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFormData(prev => ({ ...prev, video: null }))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-6 bg-zinc-800" />

        <div className="space-y-2">
          <Label className="text-zinc-400">Upload Thumbnail</Label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 bg-gradient-to-b from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 transition-all duration-300">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'thumbnail')}
              className="hidden"
              id="thumbnail-upload"
            />
            <Label htmlFor="thumbnail-upload" className="cursor-pointer block text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
              <p className="text-zinc-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-zinc-500">PNG, JPG, or WebP (max 5MB)</p>
            </Label>
          </div>
          {formData.thumbnail && (
            <div className="bg-zinc-900/50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-zinc-400 text-sm">{formData.thumbnail.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription" className="text-zinc-400">Short Description</Label>
          <Textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
            placeholder="Enter a brief description"
            className="h-24 bg-gradient-to-b from-zinc-900 to-zinc-800 border-zinc-700 focus:border-zinc-500"
            maxLength={400}
          />
          <div className="text-right text-sm text-zinc-500">
            {formData.shortDescription.length}/400 characters
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-zinc-900/50 p-4 rounded-lg">
          <Checkbox
            id="editor"
            checked={formData.useEditor}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useEditor: checked }))}
          />
          <Label htmlFor="editor" className="text-zinc-400">Use video editor</Label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Video Summary</h3>
        <div className="space-y-4">
          {[
            { label: 'Title', value: formData.title },
            { label: 'Description', value: formData.description },
            { label: 'In Playlist', value: formData.inPlaylist ? 'Yes' : 'No' },
            { label: 'Using Editor', value: formData.useEditor ? 'Yes' : 'No' },
            { label: 'Video File', value: formData.video?.name || 'Not uploaded' },
            { label: 'Video Size', value: formData.video?.size ? `${(formData.video.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A' },
            { label: 'Thumbnail', value: formData.thumbnail?.name || 'Not uploaded' }
          ].map((item, index) => (
            <div key={index} className="bg-zinc-900/50 p-3 rounded-lg">
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
      <Card className="w-full max-w-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-6">
          <CardTitle className="text-white">Upload Video</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <StepIndicator />
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentStep === 3) {
                  console.log('Form submitted:', formData);
                  onClose();
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              className="bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500"
            >
              {currentStep === 3 ? 'Submit' : 'Next'}
              {currentStep !== 3 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormPage;