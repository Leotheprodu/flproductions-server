const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
/**
 * el prompt debe ser un arreglo
 * @param {{temas, genero, feeling }} prompt
 * @returns
 */
const songNameGenerator = async (prompt) => {
    const { letra, genero } = prompt;

    const respuesta =
        await `Dame el nombre de tres canciones a partir del significado de su letra, tomando en consideracion el genero musical para que me des nombres que se ajuste al promedio de nombres de canciones.
    
    Genero musical: Reggaeton
    Letra: El viento soba tu cabello Uh, uh, uh, uh, uh Me matan esos ojos bellos Uh, uh, uh, uh, uh Me gusta tu olor, de tu piel, el color Y como me haces sentir Me gusta tu boquita, ese labial rosita Y cómo me besas a mí Contigo quiero despertar Hacerlo después de fumar (ey) Ya no tengo na' que buscar Algo fuera de aquí Tú combinas con el mar Ese bikini se ve fenomenal No hay gravedad que me pueda elevar Me pones mal a mí Aceleraste mis latidos Es que me gusta todo de ti De to'as tus partes, ¿cuál decido? Es que me gusta todo de ti Es que me gusta todo de ti Es que me gusta todo de ti Quinta Avenida, no va pa'l mall Ella sabe que le llego a todo en un call En la Raptor me gusta ponerla en Ford El jogger large, la camisa small Como la dieta keto Por ti me controlo y me quedo quieto Aunque quiero comerte to' eso completo De ese culo me volví un teco, eh Micro dosis, rola, oxy Besando esos labios glossy Ya yo le di en to'as las posi' Shampoo de coco Chanel su wallet Me vuelve loco desde el casco Hasta los pedales Contigo quiero despertar Hacerlo después de fumar Ya no tengo na' que buscar Algo fuera de aquí Tú combinas con el mar Ese bikini se ve fenomenal No hay gravedad que me pueda elevar Me pones mal a mí Aceleraste mis latidos Es que me gusta todo de ti De to'as tus partes, ¿cuál decido? Es que me gusta todo de ti Todo de ti, todo de ti Es que me gusta todo de ti Todo de ti, todo de ti Es que me gusta todo de ti Contigo quiero despertar Hacerlo después de fumar Ya no tengo na' que buscar Algo fuera de aquí Tú combinas con el mar Ese bikini se ve fenomenal No hay gravedad que me pueda elevar Me pones mal a mí
    Nombre de Cancion: Todo de Ti
    
    Genero musical: Cumbia
    Letra: Me queda un porciento
    Y lo usaré solo para decirte lo mucho que lo siento
    Que si me ven con otra en una disco solo es perdiendo el tiempo
    Baby, ¿pa’ qué te miento?
    Eso de que me vieron feliz, no, no es cierto
    
    Ya nada me hace reír
    Solo cuando veo las fotos
    Y los vídeos que tengo de ti
    Salí con otra para olvidarte
    Y tenía el perfume que te gusta a ti
    
    Prendo para irme a dormir
    Porque duermo mejor si sueño que estás aquí
    Si supieras que te escribí
    No he mandado los mensajes, siguen todos ahí
    
    ¡Guau!
    Qué mucho me ha costa’o
    Quizás te hice un favor cuando me fui de tu lado
    Borracho, viendo tus fotos
    Me duele ver que tú sí has mejorado
    
    No tienes días grises
    Ya no te duelen las cicatrices
    Y yo pensando si decirte que
    
    Me queda un porciento
    Y lo usaré solo para decirte lo mucho que lo siento
    Que si me ven con otra en una disco solo es perdiendo el tiempo
    Baby, ¿pa’ qué te miento?
    Eso de que me vieron feliz, no, no es cierto
    
    Ey, hace tiempo no pensaba en ti
    Borracho, a tu Insta, me metí
    Baby, ya yo sé, que a ti te va bien
    Que de mí tú no quieres saber, ey, ey
    
    Viviendo en un infierno que yo mismo incendié
    Jugando contigo como si fuese el die’
    Siento que ya no estoy en tu corazón
    Ahora estoy en tus pie’
    
    Rogándote
    En el tequila, ahogándome
    Los muchacho’ están invitándome a salir
    La paso bien, pero siempre termino extrañándote
    
    En el tequila, ahogándome, ey
    Las morritas texteándome, ey
    Que dónde es la peda hoy, pero
    
    Me queda un porciento
    Y lo usaré solo para decirte lo mucho que lo siento
    Que si me ven con otra en una disco solo es perdiendo el tiempo
    Baby, ¿pa’ qué te miento?
    Eso de que me vieron feliz no es cierto, ey
    Nombre de Cancion: Un x100to
    
    Genero musical: ${genero}
    Letra: ${letra}
    Nombre de Cancion:`;

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: respuesta,
        temperature: 0.7,
        max_tokens: 100,
        n: 1,
        logprobs: null,
    });

    return response.data.choices[0].text;
};

const FLPChatRecordingStudio = async (req, question) => {
    const prompt = ` detalles: Responde como un productor musical profesional asistente de LEONARDO SERRANO (LeoTheProdu) - FLProductions,
    la respuesta debe se clara, corta, directa, y si es posible recomendar el servicio de produccion completa, pues es el que ofrece mayor creatividad y es el servicio quue ofrece mejor ingresos para el estudio.
    la pregunta esta al final de este texto.
    
    Servicios ofrecidos:
    - Creación de instrumentales (beat) de cualquier género musical.
    - Grabación vocal.
    - Mezcla y masterización de canciones.
    - Afinación y edición vocal profesional con Melodyne.
    - Servicio de marketing y publicidad de canciones en plataformas digitales.
    -Produccion AudioVisual.
    -podemos trabajar a distancia.
    -Grabacion de grupos (bandas), el unico detalle es que no grabamos instrumentos como la bateria, por no contar con las instalaciones, en su lugar usamos un vst con kontakt, de manera digital.
    
    Precios aproximados:
    - Grabación de voz: 30 mil colones (incluye edición vocal, mezcla y masterización).
    - Creación de instrumental: 70 mil colones.
    - Producción completa (grabación vocal + instrumental): 100 mil colones.
    - Produccion AudioVisual,  el precio es deacuerdo a cada proyecto, es mejor conversarlo pero aproximadamente tiene un costo alrededor de los 300 dolares.
    Ubicación: Herediana de Siquirres, provincia de Limón, Costa Rica.
    - Grabacion de grupos: aproximadamente el precio puede ir desde los 100 mil colones, puede cambiar el precio deacuerdo a cantidad de instrumentos, complegidad del proyecto.
    
    Horario de atención: Con cita previa, de lunes a domingo, en cualquier hora del día o de la noche.
    
    Formas de pago: 50% al inicio y el restante al final para servicios de instrumental y producción completa. Pago completo el mismo día para grabación de voz.
    
    Tiempo de entrega: Grabación de voz en el mismo día o máximo 3 días despues de grabado. Producción completa en un mes máximo, con 2-3 sesiones de trabajo.
    
    Si no tienes una respuesta basado en esta informacion, pueden enviarla si utiliza el boton de contacto a lado derecho de esta ventana. y en menos de 24 horas recibira una respuesta. Si en la pregunta quiere agendar  una cita, puede usar el bonton de cita al lado derecho de la ventana.
    
    La pregunta es la siguiente: ${question}?.
`;

    const response = await openai.createCompletion({
        model: 'text-davinci-001',
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 256,
        n: 1,
        logprobs: null,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: req.session.user.username,
    });

    return response.data.choices[0].text;
};

module.exports = { songNameGenerator, FLPChatRecordingStudio };
