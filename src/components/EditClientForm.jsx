import PropTypes from 'prop-types';
import { useState } from "react";
import './EditClientForm.scss';  // Asegúrate de importar los estilos

function EditClientForm({ clientData, onSave, onCancel }) {
  const [newData, setNewData] = useState({
    name: clientData.name,
    addres: clientData.addres,
    phone: clientData.phone,
    email: clientData.email,
    web: clientData.web,
  });
  const [newPhotos, setNewPhotos] = useState([]);
  const [fileCount, setFileCount] = useState(0);  // Estado para la cantidad de archivos seleccionados

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos(files);
    setFileCount(files.length);  // Actualizar la cantidad de archivos seleccionados
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newData, newPhotos);  // Enviar los nuevos datos y fotos al componente principal
  };

  return (
    <div className="formEdit">
      <h1 className="formEdit__title">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="formEdit__data">
        <label className="formEdit__item">Nombre:
          <input
            type="text"
            value={newData.name}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          />
        </label>
        <label className="formEdit__item">Dirección:
          <input
            type="text"
            value={newData.addres}
            onChange={(e) => setNewData({ ...newData, addres: e.target.value })}
          />
        </label>
        <label className="formEdit__item">Teléfono:
          <input
            type="text"
            value={newData.phone}
            onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
          />
        </label>
        <label className="formEdit__item">Email:
          <input
            type="text"
            value={newData.email}
            onChange={(e) => setNewData({ ...newData, email: e.target.value })}
          />
        </label>
        <label className="formEdit__item">Web:
          <input
            type="text"
            value={newData.web}
            onChange={(e) => setNewData({ ...newData, web: e.target.value })}
          />
        </label>

        <label className="formEdit__files">
          <span className="formEdit__names">
            {fileCount > 0 ? `${fileCount} archivos seleccionados` : "Seleccionar archivos"}
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}  // Actualizar la cantidad de archivos seleccionados
          />
        </label>
        <div>
          <button type="submit" className="formEdit__save">Guardar Cambios</button>
          <button type="button" onClick={onCancel} className="formEdit__save">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

EditClientForm.propTypes = {
  clientData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    addres: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    web: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditClientForm;


