// ui/features/profile/organisms/ProfileDetails/ProfileDetails.tsx
import React, { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import getEnvVariables from '../../../../../config/configEnvs';

import SmartBox from '../../../../shared/atoms/box/SmartBox';
import Text from '../../../../shared/atoms/typography/Text';
import ProfileAvatar from '../../atoms/profileAvatar/ProfileAvatar';
import ProfileInfo from '../../moleculas/ProfileInfo/ProfileInfo';
import type { UserProfile } from '../../../../../types/profile';

import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { updateMyProfile, deleteMyProfilePhoto } from '../../../../../async/services/userProfileService';

interface Props {
  profile: UserProfile;
  onEditProfile?: () => void;
  onChangePhoto?: (file: File) => void; // opcional: si no viene, subimos aquí mismo
}

const buildImageSrc = (host: string, picture?: string) => {
  if (!picture) return undefined;
  const isAbsolute = /^https?:\/\//i.test(picture);
  if (isAbsolute) return picture;
  const cleanHost = host.replace(/\/+$/, '');
  const cleanPath = picture.replace(/^\/+/, '');
  return `${cleanHost}/${cleanPath}`;
};

const getAltFromProfile = (p: UserProfile) => {
  const full = `${p.username ?? ''} ${p.apellidoPaterno ?? ''} ${p.apellidoMaterno ?? ''}`.trim();
  return full || p.username || 'avatar';
};

const ProfileDetails: React.FC<Props> = ({ profile, onEditProfile, onChangePhoto }) => {
  const theme = useTheme();
  const { HOST } = getEnvVariables();

  const src = useMemo(() => buildImageSrc(HOST, profile.profilePicture), [HOST, profile.profilePicture]);
  const alt = useMemo(() => getAltFromProfile(profile), [profile]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // menú de acciones (ver / subir)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const fullName = useMemo(
    () =>
      `${profile.username ?? ''} ${profile.apellidoPaterno ?? ''} ${profile.apellidoMaterno ?? ''}`.trim() ||
      profile.username ||
      '',
    [profile]
  );

  const careerNames = useMemo(
    () => (profile.careers?.length ? profile.careers.map((c) => c.name).join(', ') : undefined),
    [profile.careers]
  );

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleViewPhoto = () => {
    closeMenu();
    if (src) setLightboxOpen(true);
  };

  const handlePickFile = () => {
    closeMenu();
    document.getElementById('profile-photo-input')?.click();
  };

  const parseApiErrorMessage = (e: any): string => {
    // Intenta extraer un mensaje legible desde la respuesta del backend (axios-like)
    const serverMsg = e?.response?.data?.message || e?.message || '';
    // Mensaje profesional por defecto para 400 de tipo de archivo
    if (
      e?.response?.status === 400 &&
      /tipo de archivo no permitido|file type|unsupported|no permitido/i.test(serverMsg)
    ) {
      return 'El formato del archivo no está habilitado o el administrador no lo ha autorizado.';
    }
    // Fallback genérico
    return serverMsg || 'No se pudo actualizar la foto de perfil. Inténtalo nuevamente.';
  };

  const handleInternalUpload = async (file: File) => {
    try {
      setErrorMsg(null);
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file); // SOLO foto
      await updateMyProfile(fd);
      // Si tienes un refetch global del perfil, úsalo aquí.
      // Por ahora mantenemos la recarga simple:
      window.location.reload();
    } catch (e) {
      console.error(e);
      setErrorMsg(parseApiErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    closeMenu();
    const ok = window.confirm('¿Deseas eliminar tu foto de perfil?');
    if (!ok) return;
    try {
      setErrorMsg(null);
      setUploading(true);
      await deleteMyProfilePhoto();
      window.location.reload();
    } catch (e) {
      console.error(e);
      setErrorMsg('No se pudo eliminar la foto de perfil. Inténtalo nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SmartBox column center radius="md2x" shadow="md" p="px12" sx={{ gap: theme.spacing(3), width: '100%' }}>
      {/* Alerta única en la IU (solo cuando hay error) */}
      {errorMsg && (
        <Alert
          severity="warning"
          onClose={() => setErrorMsg(null)}
          sx={{ width: '100%' }}
        >
          {errorMsg}
        </Alert>
      )}

      <SmartBox row between sx={{ width: '100%' }}>
        <Text headingLevel="h3" weight="bold" as="h2" sx={{ mb: 0.5 }}>
          Perfil
        </Text>

        {onEditProfile && (
          <Button
            variant="contained"
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={onEditProfile}
            aria-label="Editar perfil"
          >
            Editar perfil
          </Button>
        )}
      </SmartBox>

      <SmartBox column center sx={{ gap: theme.spacing(1.5) }}>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
            '&:hover .change-photo': { opacity: 1 },
            cursor: 'pointer',
          }}
          onClick={openMenu}
          aria-label="Opciones de foto de perfil"
          role="button"
        >
          <ProfileAvatar
            src={src}
            alt={alt}
            sx={{
              width: 112,
              height: 112,
              boxShadow: theme.shadows[3],
              border: `3px solid ${theme.palette.background.paper}`,
              [theme.breakpoints.up('md')]: { width: 128, height: 128 },
              opacity: uploading ? 0.6 : 1,
              pointerEvents: uploading ? 'none' : 'auto',
            }}
          />

          <Box
            className="change-photo"
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.35)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              opacity: 0,
              transition: 'opacity 160ms ease',
              pointerEvents: 'none',
            }}
          >
            <SmartBox row center sx={{ gap: 1 }}>
              <PhotoCameraOutlinedIcon fontSize="small" />
              <Text size="sm" weight="bold">{uploading ? 'Actualizando...' : 'Opciones'}</Text>
            </SmartBox>
          </Box>

          {/* Input oculto para subir nueva foto */}
          <input
            id="profile-photo-input"
            type="file"
            // OJO: mantenemos accept amplio; más adelante puedes restringirlo
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (onChangePhoto) onChangePhoto(f);
              else handleInternalUpload(f);
              e.currentTarget.value = '';
            }}
            style={{ display: 'none' }}
          />
        </Box>

        <SmartBox column center sx={{ gap: theme.spacing(0.5) }}>
          <Text headingLevel="h2" weight="bold" as="h1" align="center">
            {fullName}
          </Text>

          {careerNames && (
            <Text size="md" colorKey="text.secondary" align="center">
              {careerNames}
            </Text>
          )}
        </SmartBox>
      </SmartBox>

      {/* Menú de acciones de foto: Ver / Subir / Eliminar */}
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={handleViewPhoto} disabled={!src}>
          <ListItemIcon><VisibilityOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Ver foto de perfil" />
        </MenuItem>
        <MenuItem onClick={handlePickFile} disabled={uploading}>
          <ListItemIcon><UploadOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={uploading ? 'Subiendo...' : 'Subir nueva foto'} />
        </MenuItem>
        <MenuItem onClick={handleDeletePhoto} disabled={uploading || !src}>
          <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Eliminar foto" />
        </MenuItem>
      </Menu>

      <ProfileInfo data={profile} />

      {/* Lightbox imagen */}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md">
        <IconButton
          aria-label="close"
          onClick={() => setLightboxOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, background: 'black' }}>
          {src && (
            <img
              src={src}
              alt="Foto de perfil"
              style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </SmartBox>
  );
};

export default ProfileDetails;

