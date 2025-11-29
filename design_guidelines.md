# Vortex Meet - Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from modern video conferencing leaders:
- **Primary References**: Zoom's interface clarity, Google Meet's minimalism, Discord's dark theme execution
- **Design Principle**: Functional elegance - prioritize usability while maintaining sleek, modern aesthetics
- **Dark Theme Mandate**: All interfaces use dark backgrounds with high contrast for extended viewing comfort

## Core Design Elements

### Typography
- **Primary Font**: Inter or DM Sans via Google Fonts CDN
- **Hierarchy**:
  - H1 (Meeting titles): text-2xl font-semibold
  - H2 (Section headers): text-xl font-medium
  - Body text: text-base font-normal
  - UI labels: text-sm font-medium
  - Helper text: text-xs text-gray-400

### Layout System
- **Spacing Units**: Tailwind units of 2, 4, 6, and 8 (e.g., p-4, gap-6, m-8)
- **Grid Structure**: Use CSS Grid for video participant layouts with dynamic columns
- **Container Widths**: Full viewport for meeting interface, max-w-7xl for pre-meeting screens

### Color Strategy (Dark Theme)
- **Background Layers**:
  - Primary bg: bg-gray-900 (#111827)
  - Secondary bg: bg-gray-800 (#1f2937)
  - Elevated elements: bg-gray-700 (#374151)
- **Accent Colors**:
  - Primary action (join/start): bg-blue-600 hover:bg-blue-700
  - Danger (leave/end): bg-red-600 hover:bg-red-700
  - Success (active mic/camera): bg-green-600
- **Text Colors**: text-white for primary, text-gray-300 for secondary, text-gray-500 for disabled
- **Borders**: border-gray-700 for subtle divisions

## Component Library

### Pre-Meeting Screen
- **Layout**: Centered card (max-w-2xl) with video preview
- **Elements**: 
  - Large video preview window with rounded corners (rounded-xl)
  - Meeting code input field (large, monospace font)
  - Device selection dropdowns (camera/microphone)
  - Settings toggle icons (gear icon)
  - Join meeting button (prominent, full width within card)

### Meeting Interface Layout
- **Video Grid** (Main Area):
  - Dynamic grid: 1 participant = full screen, 2-4 = grid-cols-2, 5-9 = grid-cols-3, 10+ = grid-cols-4
  - Each video tile: aspect-video with rounded-lg, participant name overlay at bottom
  - Active speaker: border-2 border-blue-500
  - Muted/video-off states: Show avatar with initials on gray background

- **Bottom Control Bar** (Fixed):
  - Height: h-20, bg-gray-800 with backdrop-blur
  - Controls centered with gap-4:
    - Microphone toggle (red when muted)
    - Camera toggle (red when off)
    - Screen share button
    - Participants list toggle
    - Chat toggle
    - Leave/End meeting (red, positioned far right)
  - Icons: Use Heroicons (outline style, size-6)

- **Side Panel** (Collapsible, 320px width):
  - Chat messages: scrollable list with timestamps
  - Participants list: avatars with online indicators
  - bg-gray-800 with border-l border-gray-700

### UI Components
- **Buttons**:
  - Primary: px-6 py-3 rounded-lg font-medium
  - Icon buttons: p-3 rounded-full hover:bg-gray-700 transition
  - Toggle states: Use bg-opacity for active/inactive
  
- **Input Fields**:
  - Dark variant: bg-gray-700 border-gray-600 text-white placeholder-gray-400
  - Focus state: ring-2 ring-blue-500
  - Padding: px-4 py-3 rounded-lg

- **Cards/Modals**:
  - bg-gray-800 with shadow-2xl
  - Rounded corners: rounded-xl
  - Padding: p-6 to p-8

### Notifications
- **Toast Messages**: 
  - Position: top-right with fixed positioning
  - Styles: bg-gray-800 border-l-4 (border color varies: blue=info, green=success, red=error)
  - Auto-dismiss after 4 seconds with slide-in animation

### Icons
- **Library**: Heroicons via CDN (outline variant for most, solid for active states)
- **Key Icons**: 
  - Microphone/MicrophoneOff
  - Camera/CameraOff
  - ScreenShare (Desktop icon)
  - Chat (ChatBubbleLeft)
  - Users (participant list)
  - Cog (settings)
  - Phone/PhoneXMark (end call)

## Animations
- **Minimal Motion**: 
  - Button hovers: transition-colors duration-200
  - Panel slides: transition-transform duration-300
  - Video tile additions: fade-in (opacity transition)
- **No Auto-Playing Animations**: Avoid distracting effects during video calls

## Accessibility
- High contrast maintained throughout (WCAG AAA compliance)
- Focus indicators: ring-2 ring-blue-500 on all interactive elements
- Keyboard shortcuts: Display tooltip on hover showing hotkeys (M=mute, V=video, etc.)
- Screen reader labels for all icon-only buttons

## Images
No hero images needed - this is a functional web application. All visuals are user-generated (video streams and avatars).
