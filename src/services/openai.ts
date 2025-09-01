const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits';

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to keep aspect ratio
      const maxDimension = 1024; // Max width or height
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};



const LAD_PROMPT = `Transform the person in the uploaded image into a cartoon version inspired by this reference image: https://i.ibb.co/vCyBhpgJ/lad.png

CRITICAL: PRESERVE ALL ORIGINAL CHARACTERISTICS - Keep ALL recognizable traits from the uploaded image so the person remains completely identifiable: exact skin tone/color (including non-human colors like green, blue, purple, etc.), precise hairstyle and hair color, facial structure, ALL clothing items and outfits, accessories (hats, glasses, jewelry, etc.), objects they're holding, background elements, and ANY fantasy or animal characteristics (ears, tails, wings, horns, scales, fur patterns, etc.). If the character has animal features, fantasy elements, or unusual skin colors, these MUST be maintained exactly.

Redraw them in the satirical parody style of the reference image with these CRITICAL FEATURES: an EXTREMELY RIDICULOUSLY LONG CHIN that extends dramatically downward (at least 4x normal length), massive oversized biceps and forearms, enormous chest muscles, huge thighs, and most importantly - position them in a WEIRD BIZARRE BODYBUILDER POSE with arms flexed in awkward unnatural angles, legs spread in an exaggerated wide stance or strange twisted position, angular nose, sharp jawline, exaggerated hair maintaining the ORIGINAL COLOR but in bright triangular spikes, and bold facial exaggerations. The chin should be absurdly elongated and prominent.

Apply bold black outlines, crooked/uneven lines, flat 2D coloring with no shading, and a rough, intentionally ugly comic aesthetic, like Microsoft Paint drawings. ALL clothing, accessories, objects, and background elements should match the original from the uploaded image but simplified into flat cartoon colors while maintaining their distinctive features and colors.

The result should blend the complete individuality and ALL characteristics of the uploaded image with the absurd, hyper-masculine parody style of the reference image, emphasizing the ridiculously long chin and weird bodybuilder pose while preserving EVERY detail that makes the original character unique.`;  



export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const generateLadMakerImage = async (imageFile: File): Promise<GenerateImageResponse> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyStart: apiKey?.substring(0, 10) || 'none'
    });
    
    if (!apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.'
      };
    }

    if (apiKey.includes('your_ope') || apiKey.includes('************')) {
      return {
        success: false,
        error: 'OpenAI API key is still using placeholder value. Please check your Netlify environment variables.'
      };
    }

    // Validate file type - Image API edits endpoint supports PNG, JPEG, and GIF
    const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!supportedTypes.includes(imageFile.type)) {
      return {
        success: false,
        error: `Unsupported file type: ${imageFile.type}. Please use PNG, JPEG, or GIF.`
      };
    }

    // Compress if file is too large (50MB limit for GPT Image)
    let processedFile = imageFile;
    if (imageFile.size > 50 * 1024 * 1024) {
      console.log('Image too large, compressing...', { originalSize: imageFile.size });
      processedFile = await compressImage(imageFile);
      console.log('Image compressed', { newSize: processedFile.size });
    }



    console.log('Sending request with:', {
      fileType: processedFile.type,
      fileSize: processedFile.size,
      fileName: processedFile.name
    });

    // Create FormData for the Image API
    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', LAD_PROMPT);
    formData.append('image', processedFile);
    formData.append('size', '1024x1024'); // Standard size for edits endpoint
    formData.append('quality', 'medium'); // Medium quality for faster generation

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return {
        success: false,
        error: `OpenAI Error: ${errorData.error?.message || 'Unknown error'}`
      };
    }

    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data, null, 2));
    
    // Handle Image API response format
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return {
        success: false,
        error: 'No image data returned from OpenAI Image API'
      };
    }

    // Check if we have either URL or base64 data
    const imageData = data.data[0];
    let imageUrl: string;
    
    if (imageData.url) {
      // If we get a URL, use it directly
      imageUrl = imageData.url;
    } else if (imageData.b64_json) {
      // If we get base64 data, convert it to a blob URL
      try {
        const binaryString = atob(imageData.b64_json);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const imageBlob = new Blob([bytes], { type: 'image/png' });
        imageUrl = URL.createObjectURL(imageBlob);
      } catch {
        return {
          success: false,
          error: 'Failed to process base64 image data'
        };
      }
    } else {
      return {
        success: false,
        error: 'No image URL or base64 data in response'
      };
    }

    return {
      success: true,
      imageUrl: imageUrl
    };
    
  } catch (error) {
    console.error('Request failed:', error);
    return {
      success: false,
      error: `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};