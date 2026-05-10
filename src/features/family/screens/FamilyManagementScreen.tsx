import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { FamilyHeader } from '../components/FamilyHeader';
import { MemberList } from '../components/MemberList';
import { InvitationSection } from '../components/InvitationSection';
import { MemberActionsModal } from '../components/MemberActionsModal';
import { MOCK_MEMBERS, FamilyMember } from '../components/managment/mock-data';
import { Button } from '@/core/ui/button';
import { useFamily, useRegenerateCode, useDeleteFamily } from '../hooks/use-family';
import { QrCodeModal } from '../components/QrCodeModal';
import { DeleteFamilyModal } from '../components/DeleteFamilyModal';

export default function FamilyManagementScreen() {
  const { family } = useFamily();
  const { regenerateCode, loading: regenerating } = useRegenerateCode();
  const { deleteFamily, loading: deleting } = useDeleteFamily();

  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isActionsModalVisible, setIsActionsModalVisible] = useState(false);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string | undefined>(
    family?.invitationCode,
  );

  useEffect(() => {
    if (family?.invitationCode) {
      setInvitationCode(family.invitationCode);
    }
  }, [family?.invitationCode]);

  const handleRegenerateCode = async () => {
    if (!family?.id) return;
    const newCode = await regenerateCode(family.id);
    if (newCode) {
      setInvitationCode(newCode);
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


  const handleSetRole = (role: 'ADMINISTRATOR' | 'MEMBER' | 'CAREGIVER') => {
    if (selectedMember) {
      const updatedMembers = members.map((m) =>
        m.id === selectedMember.id ? { ...m, role } : m
      );
      setMembers(updatedMembers);
    }
    handleCloseActionsModal();
  };

  const handleRemoveMember = () => {
    if (selectedMember) {
      Alert.alert(
        'Eliminar Miembro',
        `¿Estás seguro de que quieres eliminar a ${selectedMember.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              const updatedMembers = members.filter((m) => m.id !== selectedMember.id);
              setMembers(updatedMembers);
              handleCloseActionsModal();
            },
          },
        ]
      );
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
    <ScrollView style={styles.container}>
      <FamilyHeader />
      <MemberList onShowActions={handleShowActions} />
      <View style={styles.separator} />
      <InvitationSection
        invitationCode={invitationCode}
        onRegenerateCode={handleRegenerateCode}
        isRegenerating={regenerating}
        onShowQr={() => setIsQrModalVisible(true)}
      />
      <View style={styles.separator} />
      <View style={styles.footer}>
        <Button
          label="Eliminar Familia"
          onPress={() => setIsDeleteModalVisible(true)}
          variant="danger"
        />
      </View>
      <MemberActionsModal
        member={selectedMember}
        visible={isActionsModalVisible}
        onClose={handleCloseActionsModal}
        onSetRole={handleSetRole}
        onRemove={handleRemoveMember}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDF6',
  },
  separator: {
    height: 48,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
