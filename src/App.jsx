import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Upload from './pages/Upload'
import ProcessingQueue from './pages/ProcessingQueue'
import ReviewGallery from './pages/ReviewGallery'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<Upload />} />
        <Route path="/processing" element={<ProcessingQueue />} />
        <Route path="/gallery" element={<ReviewGallery />} />
        <Route path="/" element={<Upload />} />
      </Routes>
    </Router>
  )
}

export default App

