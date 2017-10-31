
var user_data = {
  maxId: 17,
  files: [
    {
      name: '根目录',
      id: 0,
      type: 'root',
      children: [
        {
          name: '框架',
          id: 1,
          pId: 0,
          type: 'floder',
          children: [
            {
              name: 'React',
              id: 3,
              pId: 1,
              type: 'floder',
              children: []
            },
            {
              name: 'Vue',
              id: 4,
              pId: 1,
              type: 'floder',
              children: [
                {
                  name: 'vue-cli',
                  id: 12,
                  pId: 4,
                  type: 'floder',
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: 'Html5',
          id: 2,
          pId: 0,
          type: 'floder',
          children: []
        },
        {
          name: '电影',
          id: 13,
          pId: 0,
          type: 'floder',
          children: []
        },
        {
          name: '动漫',
          id: 14,
          pId: 0,
          type: 'floder',
          children: []
        },
        {
          name: '休闲',
          id: 5,
          pId: 0,
          type: 'floder',
          children: [
            {
              name: '电影',
              id: 6,
              pId: 5,
              type: 'floder',
              children: [
                {
                  name: '小电影',
                  id: 7,
                  pId: 6,
                  type: 'floder',
                  children: []
                },
                {
                  name: '大电影',
                  id: 8,
                  pId: 6,
                  type: 'floder',
                  children: [
                    {
                      name: '烂片',
                      id: 9,
                      pId: 8,
                      type: 'floder',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              name: '动漫',
              id: 10,
              pId: 5,
              type: 'floder',
              children: []
            },
            {
              name: '综艺',
              id: 11,
              pId: 5,
              type: 'floder',
              children: []
            }
          ]
        },
        {
          name: 'img1',
          id: 15,
          pId: 0,
          type: 'image',
          url: './imgs/img01.jpg'
        },
        {
          name: 'img2',
          id: 16,
          pId: 0,
          type: 'image',
          url: './imgs/img03.jpg'
        }
      ]
    }

  ]
};
