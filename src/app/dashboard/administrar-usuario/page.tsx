"use client";
import Table from "@/components/Table";
import React, { useState, useMemo } from "react";

const Page = () => {
  const userData = useMemo(
    () => [
      { id: 1, usuario: "Juan Pérez" },
      { id: 2, usuario: "María López" },
      { id: 3, usuario: "Carlos García" },
      { id: 4, usuario: "Ana Torres" },
    ],
    []
  );

  const profileData = useMemo(
    () => [
      { id: 1, perfil: "Administrador" },
      { id: 2, perfil: "Usuario" },
      { id: 3, perfil: "Invitado" },
      { id: 4, perfil: "Editor" },
    ],
    []
  );

  const [userSearch, setUserSearch] = useState("");
  const [profileSearch, setProfileSearch] = useState("");

  const filteredUsers = useMemo(
    () =>
      userData.filter((row) =>
        row.usuario.toLowerCase().includes(userSearch.toLowerCase())
      ),
    [userSearch, userData]
  );

  const filteredProfiles = useMemo(
    () =>
      profileData.filter((row) =>
        row.perfil.toLowerCase().includes(profileSearch.toLowerCase())
      ),
    [profileSearch, profileData]
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Filtrar por Usuario
        </label>
        <div className="relative">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar usuario..."
          />
        </div>
        <Table
          columns={[
            { key: "id", label: "Código" },
            { key: "usuario", label: "Usuario" },
          ]}
          rows={filteredUsers}
          onEdit={(id) => alert(`Editando usuario ${id}`)}
          onDelete={(id) => alert(`Eliminando usuario ${id}`)}
          actions={["edit", "delete"]}
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Filtrar por Perfil
        </label>
        <div className="relative">
          <input
            type="text"
            value={profileSearch}
            onChange={(e) => setProfileSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar perfil..."
          />
        </div>
        <Table
          columns={[
            { key: "id", label: "Código" },
            { key: "perfil", label: "Perfil" },
          ]}
          rows={filteredProfiles}
          onEdit={(id) => alert(`Editando perfil ${id}`)}
          onDelete={(id) => alert(`Eliminando perfil ${id}`)}
          actions={["edit", "delete"]}
        />
      </div>
    </div>
  );
};

export default Page;
