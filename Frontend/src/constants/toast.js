// Import the functions from react-toastify
import {toast, Bounce} from 'react-toastify';

// Connecting with css for styles
import 'react-toastify/dist/ReactToastify.css';

// Displays success toast notification with specified options and customised messages 
export function successToast(message){
    toast.success(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
}

// Displays error toast notification with specified options and customised messages 
export function ErrorToast(message) {
    toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
}