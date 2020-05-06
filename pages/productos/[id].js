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

  // Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // Context de firebase
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    if (id) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data());
          console.log(producto.data());
        } else {
          setError(true);
        }
      };
      obtenerProducto();
    }
  }, [id]);

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
              Publicado hace:
              {formatDistanceToNow(new Date(creado), { locale: es })}
            </p>
            <img src={urlimagen} />
            <p>{descripcion}</p>

            <h2>Agrega tu comentario</h2>
            <form>
              <Campo>
                <input type="text" name="mensaje" />
              </Campo>

              <InputSubmit type="submit" value="Agregar comentario" />
            </form>

            <h2
              css={css`
                margin: 2rem 0;
              `}
            >
              Comentarios
            </h2>
            {comentarios.map((comentario) => (
              <li>
                <p>{comentario.nombre}</p>
                <p>Escrito por: {comentario.usuarioNombre}</p>
              </li>
            ))}
          </div>

          <aside>2</aside>
        </ContenedorProducto>
      </div>
    </Layout>
  );
};

export default Producto;
