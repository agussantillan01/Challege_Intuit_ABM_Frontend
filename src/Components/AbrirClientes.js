import React from "react";
import {useEffect, useState} from 'react';
import axios from 'axios';
import { abrir_Alerta } from "../Functions";

const AbrirClientes = () => {
    const url = "https://localhost:7215/";
    const [clientes, setClientes] = useState([]);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [cuit, setCuit] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [titulo, setTitulo] = useState('');

    const [search, setSearch] = useState('');
    const [op, setOperacion] = useState(1);

    useEffect(() => {
        getClientes();
    }, [search]);

    const getClientes = async () => {
        try {
            const response = await axios.get(`${url}getAll`, {
                params: { search }, 
              });
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        }
    };

    const abrirModal = async (am, id) => {
        setOperacion(am);
        setTitulo(am === 1 ? "Agregar Cliente" : "Editar Cliente");
    
        if (am === 1) {
            setId('');
            setNombre('');
            setApellido('');
            setFechaNacimiento('');
            setCuit('');
            setDomicilio('');
            setTelefono('');
            setEmail('');
        } else if (am === 2 && id) {
            try {
                const response = await axios.get(`${url}Get?id=${id}`);
                const data = response.data;
    
                setId(data.id);
                setNombre(data.nombre);
                setApellido(data.apellido);
                setFechaNacimiento(formatFecha(data.fechaNacimiento));
                setCuit(data.cuit);
                setDomicilio(data.domicilio);
                setTelefono(data.telefono);
                setEmail(data.email);
            } catch (error) {
                console.error("Error al obtener los datos del cliente:", error);
            }
        }
    
        setTimeout(() => {
            document.getElementById("nombre").focus();
        }, 500);
    };
    const formatFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const anio = fechaObj.getFullYear();
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const dia = fechaObj.getDate().toString().padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };
    const Guardar = async () => {
        try {
            if (op === 1) { 
                await Insertar({ nombre, apellido, fechaNacimiento, cuit, domicilio, telefono, email });
            } else { 
                await Actualizar({ id, nombre, apellido, fechaNacimiento, cuit, domicilio, telefono, email });
            }
            getClientes();
        } catch (error) {
            if (error.isAxiosError) {
                const errorMessage = error.response ? error.response.data : error.message;
                abrir_Alerta(errorMessage, 'warning');
            } else {
                abrir_Alerta('Ha ocurrido un error inesperado', 'warning');
            }
        }
    };
    
    const Insertar = async (cliente) => {
        try {
            const response = await axios.post(`${url}Insert`, cliente);
            console.log("Cliente insertado:", response.data);
        } catch (error) {
            console.error("Error al insertar el cliente:", error);
            throw error;
        }
    };
    
    const Actualizar = async (cliente) => { 
        try {
            const response = await axios.post(`${url}Update`, cliente);
            console.log("Cliente Actualizado:", response.data);
        } catch (error) {
            console.error("Error al insertar el cliente:", error);
            throw error;  
        }
    };
    

    const Delete = async (id) => { 
        try {
            console.log("DESDE DELETE: ", id);
            const response = await axios.post(`${url}Delete?id=${id}`);
            getClientes();
        } catch (error) {
            throw error;  
        }
    };
    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-4">
                        <div className="d-grid mx-auto">
                            <button
                                onClick={() => abrirModal(1)}
                                className="btn btn-dark"
                                data-bs-toggle="modal"
                                data-bs-target="#modalclientes"
                            >
                                <i className="fa-solid fa-circle-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                <div className="col-md-4 offset-md-4">
                <input type="text" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}>
                </input>
                </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>NOMBRE</th>
                                        <th>APELLIDO</th>
                                        <th>EMAIL</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {clientes.map((cliente, i) => (
                                        <tr key={cliente.id}>
                                            <td>{i + 1}</td>
                                            <td>{cliente.nombre}</td>
                                            <td>{cliente.apellido}</td>
                                            <td>{cliente.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => abrirModal(2, cliente.id)}
                                                    className="btn btn-warning"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalclientes"
                                                >
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>

                                                <button
                                                onClick={() => Delete(cliente.id)}
                                                    className="btn btn-remove"
                                                >
                                                    <i className="fa-solid fa-remove"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalclientes" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{titulo}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id" value={id} />
                            
                            <div className="mb-3">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    className="form-control"
                                    placeholder="Apellido"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    id="fechaNacimiento"
                                    className="form-control"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>CUIT</label>
                                <input
                                    type="text"
                                    id="cuit"
                                    className="form-control"
                                    placeholder="CUIT"
                                    value={cuit}
                                    onChange={(e) => setCuit(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Domicilio</label>
                                <input
                                    type="text"
                                    id="domicilio"
                                    className="form-control"
                                    placeholder="Domicilio"
                                    value={domicilio}
                                    onChange={(e) => setDomicilio(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    id="telefono"
                                    className="form-control"
                                    placeholder="Teléfono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="d-grid">
                                <button onClick={ () => Guardar()} className="btn btn-success">
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AbrirClientes;