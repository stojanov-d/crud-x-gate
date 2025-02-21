export default (db) => {
    const { User, Project, Task } = db;
  
    User.hasMany(Project, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
    Project.belongsTo(User);
  
    Project.hasMany(Task, {
      foreignKey: {
        name: 'projectId',
        allowNull: false
      }
    });
    Task.belongsTo(Project);
  };