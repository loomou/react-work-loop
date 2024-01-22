const Tree = {
  name: 'a',
  children: [
    {
      name: 'b',
      children: [
        {
          name: 'e',
          children: [
            {
              name: 'i'
            },
            {
              name: 'j',
              children: [
                {
                  name: 'p'
                }
              ]
            }
          ]
        },
        {
          name: 'f',
        }
      ]
    },
    {
      name: 'c',
      children: [
        {
          name: 'g',
          children: [
            {
              name: 'k',
            },
            {
              name: 'l'
            }
          ]
        },
        {
          name: 'h',
          children: [
            {
              name: 'm'
            },
            {
              name: 'n'
            },
            {
              name: 'o'
            }
          ]
        }
      ]
    }
  ]
};

export default Tree;