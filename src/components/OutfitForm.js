
   import { useFormik } from 'formik';
   import * as Yup from 'yup';
   import axios from 'axios';

   function OutfitForm({ outfit = null, onSave }) {
     const formik = useFormik({
       initialValues: {
         title: outfit?.title || '',
         description: outfit?.description || '',
         category: outfit?.category || '',
         image: null,
       },
       enableReinitialize: true,
       validationSchema: Yup.object({
         title: Yup.string().min(3, 'Title must be at least 3 characters').required('Required'),
         description: Yup.string().required('Required'),
         category: Yup.string().required('Required'),
         image: outfit ? Yup.mixed().nullable() : Yup.mixed().required('Image is required'),
       }),
       onSubmit: async (values) => {
         const formData = new FormData();
         formData.append('title', values.title);
         formData.append('description', values.description);
         formData.append('category', values.category);
         if (values.image) formData.append('image', values.image);
         try {
           const url = outfit ? `http://localhost:5000/api/outfits/${outfit.id}` : 'http://localhost:5000/api/outfits';
           const method = outfit ? 'put' : 'post';
           await axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
           onSave();
         } catch (err) {
           console.error('Outfit form error:', err.response?.data || err.message);
           alert('Failed to save outfit: ' + (err.response?.data?.error || 'Server error'));
         }
       },
     });

     return (
       <form onSubmit={formik.handleSubmit} className="mb-4">
         <div className="mb-4">
           <input
             type="text"
             name="title"
             placeholder="Title"
             onChange={formik.handleChange}
             value={formik.values.title}
             className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
           />
           {formik.errors.title && <div className="error">{formik.errors.title}</div>}
         </div>
         <div className="mb-4">
           <input
             type="text"
             name="description"
             placeholder="Description"
             onChange={formik.handleChange}
             value={formik.values.description}
             className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
           />
           {formik.errors.description && <div className="error">{formik.errors.description}</div>}
         </div>
         <div className="mb-4">
           <input
             type="text"
             name="category"
             placeholder="Category"
             onChange={formik.handleChange}
             value={formik.values.category}
             className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
           />
           {formik.errors.category && <div className="error">{formik.errors.category}</div>}
         </div>
         <div className="mb-4">
           <input
             type="file"
             name="image"
             onChange={(event) => formik.setFieldValue('image', event.target.files[0])}
             className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
           />
           {formik.errors.image && <div className="error">{formik.errors.image}</div>}
         </div>
         <button type="submit" className="bg-gradient-pink-purple text-white px-4 py-2 rounded hover:bg-pink-600">
           {outfit ? 'Update' : 'Create'} Outfit
         </button>
       </form>
     );
   }

   export default OutfitForm;
