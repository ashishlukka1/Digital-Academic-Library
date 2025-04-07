import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Home from './Components/Home/Home';
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import Userprofile from './Components/User/Userprofile';
// import StudyChatApp from './Components/Forum/StudyChatApp';
import WebSocketComponent from './Components/Forum/WebSocketComponent';

import Chatbot from './Components/chatbot/ChatBot'; 
import OpenLibrary from '../src/Components/User/OpenLibrary'
import Faculty from './Components/Faculty/Faculty';
import AcademicResourceRequest from '../src/Components/AcademicResourceRequestForm';
import PublishBookForm from './Components/Faculty/PublishBookForm';
import GoogleDrivePDFViewer from './Components/PdfReader/GoogleDrivePDFReader';
import ResourceRequests from './Components/Faculty/ResourceRequests';
import ReserveBook from './Components/User/ReserveBook';
import ChatRoom from './Components/Forum/ChatRoom';
import Guest from './Components/Guest/Guest';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ height: '100vh', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="userprofile" element={<Userprofile />} />
            <Route path="guest" element={<Guest />} />

            <Route path="facultyprofile" element={<Faculty />} />
            <Route path="userprofile/discussion-forum" element={<WebSocketComponent/>} />
            <Route path="room/:roomName" element={<ChatRoom/>} />
            <Route path="userprofile/openlibrary" element={<OpenLibrary/>} />
            <Route path="resourse-req" element={<AcademicResourceRequest/>} />
            <Route path="publish" element={<PublishBookForm/>} />
            <Route path="reader" element={<GoogleDrivePDFViewer/>} />
            <Route path="requests" element={<ResourceRequests/>} />
            <Route path="/offline-book-service" element={<ReserveBook/>} />
          </Route>
        </Routes>

        <Chatbot />
      </div>
    </Router>
  );
}

export default App;

// import React from 'react'
// import AcademicResourceRequest from '../src/Components/AcademicResourceRequestForm'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import StudyChatApp from './Components/Forum/StudyChatApp'

// function App() {
//   return (
//     <div>
//       <AcademicResourceRequest/>  
//       {/* <StudyChatApp/> */}
//     </div>
//   )
// }

// export default App