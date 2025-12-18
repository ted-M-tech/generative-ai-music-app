import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { useState } from "react";
import axios from "axios";

function CreatePage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedMusic, setGeneratedMusic] = useState("");

  const handleGenerate = async () => {
    const apikey = import.meta.env.VITE_LOUDLY_API_KEY;
    try {
      const formData = new FormData();
      const musicPrompt = `Create a ${genre} song titled "${title}". Music style: ${prompt}. High quality production with clear melody and rhythm. `;
      formData.append("prompt", musicPrompt);
      formData.append("duration", "30");

      const response = await axios.post(
        "https://soundtracks.loudly.com/api/ai/prompt/songs",
        formData,
        {
          headers: {
            "API-KEY": apikey,
          },
        }
      );

      if (response.data && response.data.music_file_path) {
        setGeneratedMusic(response.data.music_file_path);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleSave = () => {
    if (!generatedMusic || !title || !prompt || !genre) {
      alert("Save after generating music");
    }

    const musicData = {
      id: Date.now().toString(),
      title: title,
      genre: genre,
      prompt: prompt,
      audioUrl: generatedMusic,
      coverUrl: `https://picsum.photos/400/400?random=${Date.now()}`,
    };

    const savedMusic = JSON.parse(
      localStorage.getItem("generatedMusic") || "[]"
    );
    savedMusic.push(musicData);
    localStorage.setItem("generatedMusic", JSON.stringify(savedMusic));

    alert("Saved generated music");
  };

  return (
    <div>
      <h1>Music Generate Page</h1>
      <div>
        <div>
          <label>Music Title</label>
          <p>{title}</p>
          <Input
            value={title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Input music title"
          />
        </div>
        <div>
          <label>Genre</label>
          <p>{genre}</p>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Select genre">Select genre</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classic">classic</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label>Prompt to generate a music </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write prompt to generate a music."
          ></Textarea>
        </div>
        <Button onClick={handleGenerate}>Generate Music</Button>

        {generatedMusic && (
          <div>
            <h3>Generated Music</h3>
            <audio controls>
              <source src={generatedMusic} type="audio/mpeg" />
            </audio>
            <br />
            <Button onClick={handleSave}>Save Music</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePage;
