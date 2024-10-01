interface NewSceneModalProps {
    title: string;
    visible: boolean;
    fetchData: (page?: number, pageSize?: number) => Promise<void>;
    closeModel: () =>(void);
  }