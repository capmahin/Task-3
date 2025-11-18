# Three.js 3D Model Viewer with Vite

This project is a 3D web application built with Three.js and Vite that demonstrates advanced 3D model loading, animation, and interaction capabilities.

## Key Features Implemented

### 3D Model Loading System
- **GLTF/GLB Support**: Implements robust loading of 3D models in GLTF/GLB formats
- **DRACO Compression**: Configured DRACOLoader with local decoder files for efficient compressed model loading
- **Model Switching**: Dynamic switching between different 3D models at runtime
- **Proper Scaling & Positioning**: Automatic scaling and centering of models for consistent display
- **Floor Alignment**: Models automatically aligned to the floor plane for realistic positioning

### Animation System
- **Animation Mixer**: Full animation support using Three.js AnimationMixer
- **Automatic Playback**: Animations play automatically when detected in loaded models
- **Smooth Transitions**: Seamless animation updates in the render loop

### Interactive Controls
- **Orbit Controls**: Full camera control with mouse/touch for rotating, panning, and zooming
- **Real-time Lighting Control**: Interactive GUI for adjusting all light parameters
- **Model Switch Button**: UI button to toggle between different 3D models

### Advanced Rendering Features
- **Shadow Mapping**: Realistic shadows cast by models and lights
- **Environment Lighting**: Room environment mapping for realistic reflections
- **Multiple Light Types**: Ambient, directional, and point lights for dynamic lighting setups
- **Anti-aliasing**: High-quality rendering with anti-aliasing enabled

### Responsive Design
- **Window Resizing**: Automatic adjustment to window size changes
- **Device Pixel Ratio**: Proper scaling for high-DPI displays
- **Fullscreen Display**: Clean fullscreen canvas presentation

### Development Features
- **Hot Reloading**: Instant preview of code changes with Vite's development server
- **Modular Architecture**: Well-organized code structure for easy maintenance
- **Error Handling**: Graceful handling of model loading failures
- **Progress Tracking**: Console logging of model loading progress

## Technical Implementation Details

### File Structure
```
project/
├── src/
│   ├── index.html          # Main HTML file
│   ├── script.js           # Main Three.js application
│   └── style.css           # Basic styling
├── static/                 # Static assets served by Vite
│   ├── *.glb              # 3D models (LittlestTokyo.glb, Soldier.glb)
│   └── jsm/libs/draco/    # DRACO decoder files
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

### Core Components

#### Scene Setup
- Perspective camera with 40° FOV
- WebGL renderer with shadow mapping
- OrbitControls for camera manipulation
- PMREM environment for realistic reflections

#### Lighting System
- Ambient light (soft overall illumination)
- Directional light (sun-like primary light with shadows)
- Point light (localized illumination with shadows)

#### Model Management
- Dynamic model loading/unloading
- Automatic model centering and floor alignment
- Scale normalization for consistent sizing
- Animation detection and playback

#### User Interface
- lil-gui control panel for real-time parameter adjustment
- Model switching button with dynamic labeling
- Clean fullscreen canvas presentation

### Dependencies Used
- **three**: Core Three.js library for 3D rendering
- **@tresjs/cientos**: Additional Three.js utilities
- **lil-gui**: Lightweight GUI for parameter control
- **vite**: Fast development build tool

## How to Use

### Running the Application
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to displayed localhost URL

### Interacting with the Application
- **Camera Controls**: 
  - Left-click + drag: Rotate view
  - Right-click + drag: Pan view
  - Scroll: Zoom in/out
- **Lighting Controls**: Use the GUI panel to adjust light properties
- **Model Switching**: Click the "Switch to Soldier/LittlestTokyo" button

### Adding New Models
1. Place GLB files in the `static/` directory
2. Update the model loading paths in [script.js](file:///F:/Task-1/task-3/src/script.js)
3. Adjust scaling factors as needed for proper display

## Performance Considerations
- DRACO compression reduces model file sizes significantly
- Efficient animation loop with delta time calculation
- Proper disposal of previous models when switching
- Optimized shadow rendering settings