import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

function App() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
