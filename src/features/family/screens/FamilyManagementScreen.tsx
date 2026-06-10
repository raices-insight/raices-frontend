import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Pressable, Text } from 'react-native';
import { FamilyHeader } from '../components/FamilyHeader';
import { MemberList } from '../components/MemberList';
import { InvitationSection } from '../components/InvitationSection';
import { MemberActionsModal } from '../components/MemberActionsModal';
import { TransferAdminModal } from '../components/TransferAdminModal';
import type { FamilyMember } from '../api/schemas';
import {
  useFamily,
  useFamilyDetails,
  useRegenerateCode,
  useDeleteFamily,
  useLeaveFamily,
  useExpulseMember,
} from '../hooks/use-family';
import { QrCodeModal } from '../components/QrCodeModal';
import { DeleteFamilyModal } from '../components/DeleteFamilyModal';
import { useAuth } from '@/features/auth/context/auth-context';

export default function FamilyManagementScreen() {
  const { user } = useAuth();
  const { family } = useFamily();
  const { details, members, refetch, isAdmin } = useFamilyDetails(family?.id);
  const { regenerateCode, loading: regenerating } = useRegenerateCode();
  const { deleteFamily, loading: deleting } = useDeleteFamily();
  const { leaveFamily, loading: leaving } = useLeaveFamily();
  const { expulse, loading: expulsing } = useExpulseMember();

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isActionsModalVisible, setIsActionsModalVisible] = useState(false);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isTransferAdminModalVisible, setIsTransferAdminModalVisible] = useState(false);
  const [regeneratedCode, setRegeneratedCode] = useState<string | undefined>(undefined);

  const invitationCode = regeneratedCode ?? details?.invitationCode;

  const handleRegenerateCode = async () => {
    if (!family?.id) return;
    const newCode = await regenerateCode(family.id);
    if (newCode) {
      setRegeneratedCode(newCode);
    }
  };

  const handleShowActions = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsActionsModalVisible(true);
  };

  const handleCloseActionsModal = () => {
    setIsActionsModalVisible(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = () => {
    if (!selectedMember || !family?.id) return;
    Alert.alert(
      'Expulsar Miembro',
      `¿Estás seguro de que quieres expulsar a este miembro de la familia?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Expulsar',
          style: 'destructive',
          onPress: async () => {
            const success = await expulse(family.id, {
              expulsedProfileId: selectedMember.profileId,
            });
            if (success) {
              handleCloseActionsModal();
              void refetch();
            }
          },
        },
      ],
    );
  };

  const handleLeaveFamily = () => {
    if (!family?.id) return;

    if (isAdmin) {
      const otherMembers = members.filter((m) => m.profileId !== user?.id);
      if (otherMembers.length === 0) {
        Alert.alert(
          'No puedes abandonar la familia',
          'Eres el único miembro. Elimina la familia si deseas salir.',
          [{ text: 'Entendido' }],
        );
        return;
      }
      setIsTransferAdminModalVisible(true);
      return;
    }

    Alert.alert(
      'Abandonar Familia',
      '¿Estás seguro de que quieres abandonar esta familia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abandonar',
          style: 'destructive',
          onPress: async () => {
            await leaveFamily(family.id);
          },
        },
      ],
    );
  };

  const handleTransferAndLeave = async (newAdminProfileId: string) => {
    if (!family?.id) return;
    const success = await leaveFamily(family.id, newAdminProfileId);
    if (success) {
      setIsTransferAdminModalVisible(false);
    }
  };

  const handleDeleteFamily = async () => {
    if (!family?.id) return;
    const success = await deleteFamily(family.id);
    if (success) {
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <FamilyHeader imageUrl={details?.imageUrl} familyName={family?.name} />

      <MemberList
        members={members}
        currentUserId={user?.id ?? null}
        currentUserName={user?.name ?? null}
        isAdmin={isAdmin}
        onShowActions={handleShowActions}
      />

      {isAdmin && (
        <>
          <View style={styles.separator} />
          <InvitationSection
            invitationCode={invitationCode}
            onRegenerateCode={handleRegenerateCode}
            isRegenerating={regenerating}
            onShowQr={() => setIsQrModalVisible(true)}
          />

          <Pressable
            onPress={() => setIsDeleteModalVisible(true)}
            style={styles.deleteFamilyButton}
            hitSlop={6}
          >
            <Text style={styles.deleteFamilyText}>Eliminar Familia</Text>
          </Pressable>
        </>
      )}

      {family?.id && (
        <Pressable
          onPress={handleLeaveFamily}
          disabled={leaving}
          style={styles.deleteFamilyButton}
          hitSlop={6}
        >
          <Text style={styles.deleteFamilyText}>Dejar Familia</Text>
        </Pressable>
      )}

      <MemberActionsModal
        member={selectedMember}
        visible={isActionsModalVisible}
        onClose={handleCloseActionsModal}
        onRemove={handleRemoveMember}
        loading={expulsing}
      />
      <QrCodeModal
        visible={isQrModalVisible}
        onClose={() => setIsQrModalVisible(false)}
        invitationCode={invitationCode}
      />
      <DeleteFamilyModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteFamily}
        loading={deleting}
      />
      <TransferAdminModal
        visible={isTransferAdminModalVisible}
        members={members}
        currentUserId={user?.id ?? ''}
        onConfirm={handleTransferAndLeave}
        onClose={() => setIsTransferAdminModalVisible(false)}
        loading={leaving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5EC',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  separator: {
    height: 32,
  },
  deleteFamilyButton: {
    alignSelf: 'center',
    marginTop: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteFamilyText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#C53030',
    textDecorationLine: 'underline',
  },
});
