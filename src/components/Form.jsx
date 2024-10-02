import { useState, useEffect } from "react";
import credentials from "../config/configFireBase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Form.scss';

const db = getFirestore(credentials);
const storage = getStorage(credentials);

function Form() {
  const cliente = {
    name: '',
    addres: '',
    phone: '',
    web: '',
    email: ''
  }

  const [client, setClient] = useState(cliente);
  const [archivos, setArchivos] = useState([]); // Arreglo para múltiples archivos
  const [habilitar, setHabilitar] = useState(false);

  const handlerFile = (e) => {
    const archivosSeleccionados = Array.from(e.target.files); // Convierte a array
    setArchivos(archivosSeleccionados); // Guarda los archivos seleccionados
  }

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  }

  // Validación para habilitar el botón de enviar
  useEffect(() => {
    const allFieldsFilled = Object.values(client).every(field => field.trim() !== ''); // Todos los campos están llenos
    const hasFiles = archivos.length > 0; // Al menos una imagen seleccionada

    setHabilitar(allFieldsFilled && hasFiles); // Habilitar si todos los campos y archivos están llenos
  }, [client, archivos]); // Escucha cambios en client o archivos

  const save = async (e) => {
    e.preventDefault();
    try {
      const urls = [];

      for (const archivo of archivos) {
        // Subir cada imagen
        const refArchivo = ref(storage, `clientes/${archivo.name}`);
        await uploadBytes(refArchivo, archivo);
        const url = await getDownloadURL(refArchivo);
        urls.push(url); // Guardar URL de cada imagen
      }

      const newClient = {
        name: client.name,
        addres: client.addres,
        phone: client.phone,
        web: client.web,
        email: client.email,
        photos: urls // Guardar URLs de las imágenes
      };

      // Guardar cliente en Firebase
      await addDoc(collection(db, 'clientes'), newClient);
      console.log('Cliente guardado con éxito');

      // Reiniciar formulario
      setClient(cliente);
      document.getElementById('fotos').value = ''; // Reiniciar input file
      setArchivos([]);
      setHabilitar(false);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="form">
      <h1>Registro de clientes</h1>
      <form onSubmit={save}>
        <input type="text" required name='name' placeholder='Nombre' onChange={handlerChange} value={client.name} />
        <input type="text" required name='addres' placeholder='Dirección' onChange={handlerChange} value={client.addres} />
        <input type="number" required name='phone' placeholder='Teléfono' onChange={handlerChange} value={client.phone} />
        <input type="file" id="fotos" multiple required onChange={handlerFile} /> {/* Input para múltiples archivos */}
        <input type="text" required name='web' placeholder='Sitio web' onChange={handlerChange} value={client.web} />
        <input type="text" required name='email' placeholder='Email' onChange={handlerChange} value={client.email} />
        <button type="submit" className="form__save" disabled={!habilitar}>
          {habilitar ? 'Enviar' : 'Llenar los campos'}
        </button>
      </form>
    </div>
  )
}

export default Form;


