// Importation de la fonction extendTheme de Chakra UI
import { extendTheme } from '@chakra-ui/react'

// Définition du thème personnalisé
const theme = extendTheme({
    styles: {
        // eslint-disable-next-line no-unused-vars
        global: (props) => ({
            '#root': {
                width: "100%"
            },
            body: {
                bg: "#121212",
            },
        })
      },
  colors: {
    primary: 'rgba(13, 30, 62, 0.85)', // Un bleu nuit profond et semi-transparent pour l'arrière-plan et les composants clés
    secondary: 'rgba(28, 49, 90, 0.3)', // Un bleu plus clair et plus transparent pour les éléments secondaires et les arrière-plans des zones de contenu
    buttonBackground: 'rgba(178, 34, 34, 1)', // Un rouge sanglant pour les boutons, créant un contraste élevé pour l'interactivité
    buttonBackgroundHover: 'rgba(178, 34, 34, 0.7)', // Un rouge sanglant pour les boutons, créant un contraste élevé pour l'interactivité
    buttonText: 'rgba(255, 255, 255, 1)', // Blanc pur pour le texte des boutons pour assurer une bonne lisibilité
    textPrimary: 'rgba(220, 220, 220, 1)', // Un blanc cassé pour le texte principal, réduisant l'éblouissement sur un fond sombre
    textSecondary: 'rgba(169, 169, 169, 1)', // Gris clair pour les textes secondaires ou les informations moins prioritaires
    textLink: 'rgba(79, 121, 166, 1)', // Bleu gris pour les liens, indiquant l'interactivité sans être trop lumineux
    textError: 'rgba(204, 0, 0, 1)', // Rouge plus vif pour les messages d'erreur, afin qu'ils se détachent et attirent l'attention
    background: 'rgba(18, 18, 18, 1)', // Presque noir pour l'arrière-plan général de l'application, pour une immersion totale
    header: 'rgba(31, 31, 31, 1)', // Gris très sombre pour les en-têtes de l'application, fournissant une légère séparation sans contraste fort
    border: 'rgba(63, 63, 63, 1)', // Gris très sombre pour les en-têtes de l'application, fournissant une légère séparation sans contraste fort
    overlay: 'rgba(255, 255, 255, 0.05)', // Transparence très légère pour les overlays ou les effets de mouseover, juste pour indiquer l'interactivité
    premiumButton: 'rgba(192, 175, 45, 1)',
    premiumButtonText: 'rgba(23, 26, 35, 1)',
},  
  components: {
    Text: {
        baseStyle: {
            color: 'black'
        }

    },
    Li: { // Ajout d'un composant personnalisé `Li` à la configuration du thème
      // Styles pour l'état non actif
      baseStyle: {
        display: 'flex',
        gap: '10px',
        width: "80%",
        background: "transparent",
        alignItems: "center",
        borderRadius: "12px",
        padding: '5px',
        cursor: 'pointer',
        image: {
          color: "currentColor",
          background: "white",
          padding: "5px",
          borderRadius: "10px",
          boxShadow: "0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)"

        },
        text: {
            color: "#DADADA",
            fontSize: 'large',
            fontWeight: 500,
        }
      },
      // Styles pour l'état actif
      variants: {
        active: {
          bg: "white",
          padding: "15px",
          boxShadow: "0px 5px 3.5px 0px rgba(0, 0, 0, 0.02)",
          cursor: 'unset',
          image: {
            backgroundColor: "White",
            boxShadow: "none"

          },
          text: {
            color: "black",
          }
        }
      }
    },
    Table: {
      variants: {
        striped: { // Utilisation de 'striped' au lieu de 'main' pour correspondre à votre demande
          th: {
            bg: 'white',
          },
          tbody: {
            tr: {
              '&:nth-of-type(odd)': {
                backgroundColor: 'secondary', // Utilisez cette configuration pour les lignes zébrées
              },
            },
          },
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        _hover: {
          borderColor: 'transparent'// Couleur au survol (exemple)
        }, // Exemple de style de base pour les boutons
      },
      sizes: {
        // Vous pouvez définir ou étendre des tailles ici
      },
      variants: {
        // Création d'une variante personnalisée pour les boutons
        main: {
          _hover: {
            bg: 'buttonBackgroundHover', // Couleur au survol (exemple)
          },
        },
        secondary: {
            bg: 'secondary', // Utilisation de la couleur définie dans 'colors'
            color: 'black', // Couleur du texte sur le bouton
            _hover: {
              bg: 'primary', // Couleur au survol (exemple)
            },
          },
      },
      // Définition des props par défaut pour les boutons
      defaultProps: {
        size: 'md',
        variant: 'custom', // Utilisation de la variante personnalisée comme défaut
      },
    },
  },
})

// Exportation du thème personnalisé
export default theme
