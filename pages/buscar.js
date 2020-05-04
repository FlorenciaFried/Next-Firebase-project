import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';
import { useRouter } from 'next/router';

const Buscar = () => {
  return (
    <Layout>
      <h1>Buscar</h1>
    </Layout>
  );
};

export default Buscar;
