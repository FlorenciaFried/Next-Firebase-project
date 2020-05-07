import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layout/404";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  // State del componente
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});

  // Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // Context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data());
        } else {
          setError(true);
        }
      };
      obtenerProducto();
    }
  }, [id, producto]);

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }

    // Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    // Verificar si el usuario actual votó
    if (haVotado.includes(usuario.uid)) return;

    // Guardar el ID del usuario que votó
    const nuevoHaVotado = [...haVotado, usuario.uid];

    // Actualizar en la BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    // Actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
  };

  // Funciones para crear comentarios
  const comentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  // Identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  // Agrego el comentario a la lista al hacer submit
  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    // Informacion extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    // Tomar copia de los comentarios y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    // Actualizar la BD
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });

    //Actualizar el state
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
  };

  return (
    <Layout>
      <>{error && <Error404 />}</>

      <div className="contenedor">
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          {nombre}
        </h1>

        <ContenedorProducto>
          <div>
            <p>
              Publicado hace:{" "}
              {formatDistanceToNow(new Date(creado), { locale: es })}
            </p>
            <p>
              Por {creador.nombre} de {empresa}
            </p>
            <img src={urlimagen} />
            <p>{descripcion}</p>

            {usuario && (
              <>
                <h2>Agrega tu comentario</h2>
                <form onSubmit={agregarComentario}>
                  <Campo>
                    <input
                      onChange={comentarioChange}
                      type="text"
                      name="mensaje"
                    />
                  </Campo>

                  <InputSubmit type="submit" value="Agregar comentario" />
                </form>
              </>
            )}

            <h2
              css={css`
                margin: 2rem 0;
              `}
            >
              Comentarios
            </h2>

            {comentarios.length === 0 ? (
              "Aún no hay comentarios"
            ) : (
              <ul>
                {comentarios.map((comentario, i) => (
                  <li
                    key={`${comentario.usuarioId}-${i}`}
                    css={css`
                      border: 1px solid #e1e1e1;
                      padding: 2rem;
                    `}
                  >
                    <p>{comentario.mensaje}</p>
                    <p>
                      Escrito por:
                      <span
                        css={css`
                          font-weight: bold;
                        `}
                      >
                        {" "}
                        {comentario.usuarioNombre}
                      </span>
                    </p>
                    {esCreador(comentario.usuarioId) && (
                      <CreadorProducto>Es Creador</CreadorProducto>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside>
            <Boton target="_blank" bgColor="true" href={url}>
              Visitar URL
            </Boton>

            <div
              css={css`
                margin-top: 5rem;
              `}
            >
              <p
                css={css`
                  text-align: center;
                `}
              >
                {votos} Votos
              </p>

              {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
            </div>
          </aside>
        </ContenedorProducto>
      </div>
    </Layout>
  );
};

export default Producto;
