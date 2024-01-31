const Tree = {
  name: 'a',
  children: [
    {
      name: 'b',
      children: [
        {
          name: 'd',
          children: [
            {
              name: 'h'
            },
            {
              name: 'i',
              children: [
                {
                  name: 'o'
                }
              ]
            }
          ]
        },
        {
          name: 'e',
        }
      ]
    },
    {
      name: 'c',
      children: [
        {
          name: 'f',
          children: [
            {
              name: 'j',
            },
            {
              name: 'k'
            }
          ]
        },
        {
          name: 'g',
          children: [
            {
              name: 'l'
            },
            {
              name: 'm'
            },
            {
              name: 'n'
            }
          ]
        }
      ]
    }
  ]
};

export default Tree;