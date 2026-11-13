import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Status from './components/Status.jsx';
import Contact from './pages/Contact.jsx';
import Home from './pages/Home.jsx';
import News from './pages/News.jsx';
import People from './pages/People.jsx';
import Publications from './pages/Publications.jsx';
import Research from './pages/Research.jsx';

/** Route table for the public lab site. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="research" element={<Research />} />
        <Route path="people" element={<People />} />
        <Route path="publications" element={<Publications />} />
        <Route path="news" element={<News />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Status>Page not found.</Status>} />
      </Route>
    </Routes>
  );
}
