export class UserUtility {
  static getFirebaseTopicName(id: string) {
    return `t_kol_${id}`;
  }

  static getFirebaseGroupName(id: string) {
    return `g_user_${id}`;
  }
}
