export const fadeInUp = {
    initial: { opacity: 0, y: -60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: 'easeInOut' }
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 1.2 }
};

export const fadeInRight = {
    initial: { opacity: 0, x: 10 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 1.2 }
};

export const fadeInImage = {
    initial: { opacity: 0, x: -10 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 1.2 }
};

export const fadeInStart = {
    initial: { opacity: 0, y: -30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: 'easeInOut' }
};
