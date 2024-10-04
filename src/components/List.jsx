import { useState, useEffect } from "react";
import credentials from "../config/configFireBase";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import EditClientForm from "./EditClientForm";  // Importa el nuevo componente
import './List.scss';

const db = getFirestore(credentials);
const storage = getStorage(credentials);

function List() {
  const [list, setList] = useState([]);
  const [client, setClient] = useState(null);  // Cliente a editar
  const [habilitar, setHabilitar] = useState(false);

  const getClient = async (id) => {
    // Llevar el scroll a la parte superior
    window.scrollTo(0, 0);
    const docSnap = await getDoc(doc(db, 'clientes', id));
    if (docSnap.exists()) {
      setClient({ ...docSnap.data(), id: docSnap.id });
      setHabilitar(true);  // Habilitar el formulario de edición
    } else {
      console.log('No such document!');
    }
  };

  const updateClient = async (newData, newPhotos) => {
    try {
      let updatedPhotos = client.photos || [];  // Mantener las fotos actuales si no se suben nuevas

      // Subir nuevas fotos si es necesario
      if (newPhotos.length > 0) {
        updatedPhotos = [];
        for (const photo of newPhotos) {
          const storageRef = ref(storage, `clientes/${client.id}/${photo.name}`);
          await uploadBytes(storageRef, photo);
          const photoUrl = await getDownloadURL(storageRef);
          updatedPhotos.push(photoUrl);
        }
      }

      // Actualizar el cliente en Firestore
      await updateDoc(doc(db, 'clientes', client.id), {
        ...newData,
        photos: updatedPhotos
      });

      // Actualizar la lista local
      const updatedList = list.map((cli) =>
        cli.id === client.id ? { ...cli, ...newData, photos: updatedPhotos } : cli
      );
      setList(updatedList);
      setHabilitar(false);  // Ocultar el formulario
    } catch (error) {
      console.log('Error al actualizar cliente:', error);
    }
  };

  const deleteClient = async (id) => {
    try {
      const clientDoc = await getDoc(doc(db, 'clientes', id));

      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        const photos = clientData.photos || [];

        // Eliminar todas las fotos del cliente
        for (const photoUrl of photos) {
          const imageRef = ref(storage, photoUrl);
          await deleteObject(imageRef);
          console.log(`Imagen eliminada: ${photoUrl}`);
        }

        await deleteDoc(doc(db, 'clientes', id));  // Eliminar el documento del cliente
        setList(list.filter((client) => client.id !== id));  // Actualizar la lista local
      } else {
        console.log('Cliente no encontrado');
      }
    } catch (error) {
      console.log('Error al eliminar cliente:', error);
    }
  };

  useEffect(() => {
    const getList = async () => {
      const data = await getDocs(collection(db, 'clientes'));
      setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getList();
  }, []);

  return (
    <div className="list">
      <h1 className="list__title">Lista clientes</h1>
      <div className="list__data">
        {list.map((client) => (
          <div key={client.id} className="list__card">
            <div className="list__dataClient">
              {client.photos && client.photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Imagen ${index + 1} de ${client.name}`} className="list__image" />
              ))}
              <p className="list__info">{client.name}</p>
              <p className="list__info">{client.addres}</p>
              <p className="list__info">{client.phone}</p>
              <p className="list__info">{client.email}</p>
              <p className="list__info">{client.web}</p>
              <div className="list__btns">
                <button className="list__btn" onClick={() => { getClient(client.id) }}>Editar</button>
                <button className="list__btn" onClick={() => deleteClient(client.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar el formulario de edición cuando se habilite */}
      {habilitar && client && (
        <EditClientForm
          clientData={client}
          onSave={updateClient}
          onCancel={() => setHabilitar(false)}
        />
      )}
    </div>
  );
}

export default List;


