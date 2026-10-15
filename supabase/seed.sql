-- Supabase Seed: Authoritative Services
-- Contains exactly the 7 services defined for this sanctuary

INSERT INTO services (
    slug,
    name,
    type,
    description,
    duration_minutes,
    turnaround_hours,
    price_inr,
    price_usd,
    is_active,
    sort_order
)
VALUES
    (
        'tarot-1hr',
        'Tarot reading 1hr (chat/call)',
        'live',
        '/* TODO: Comprehensive 1-hour live reading via Chat or Call */ An expansive sixty-minute live consultation exploring your multi-layered questions, transitions, and energetic paths.',
        60,
        NULL,
        99900,
        3900,
        TRUE,
        1
    ),
    (
        'tarot-10min',
        'Tarot reading 10 min (in depth)',
        'live',
        '/* TODO: In-depth 10-minute live reading */ A concentrated, deep-dive session focused with precision on your most pressing immediate question.',
        10,
        NULL,
        20000,
        1200,
        TRUE,
        2
    ),
    (
        'pick-a-card',
        'Pick a card reading',
        'written',
        '/* TODO: Pick a card intuitive reading */ An intuitive card selection spread accompanied by channeled reflections and personal messages.',
        NULL,
        48,
        30000,
        1500,
        TRUE,
        3
    ),
    (
        'future-predictions',
        'Future predictions',
        'written',
        '/* TODO: Future predictions tarot spread */ A forward-looking spread mapping upcoming energetic horizons, opportunities, and subconscious currents.',
        NULL,
        48,
        30000,
        1500,
        TRUE,
        4
    ),
    (
        'birth-chart',
        'Birth chart reading',
        'written',
        '/* TODO: Birth chart astrological & tarot reading */ Synthesizing astrological placements with archetypal tarot symbolism for deeper soul alignment.',
        NULL,
        48,
        15000,
        900,
        TRUE,
        5
    ),
    (
        'career',
        'Career reading',
        'written',
        '/* TODO: Career and professional path reading */ Luminous clarity for professional crossroads, creative purpose, vocation, and leadership.',
        NULL,
        48,
        15000,
        900,
        TRUE,
        6
    ),
    (
        'love',
        'Love reading',
        'written',
        '/* TODO: Love and relationship dynamics reading */ Deep intuitive insight into partnership dynamics, emotional blockages, and heart opening.',
        NULL,
        48,
        20000,
        1200,
        TRUE,
        7
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    duration_minutes = EXCLUDED.duration_minutes,
    turnaround_hours = EXCLUDED.turnaround_hours,
    price_inr = EXCLUDED.price_inr,
    price_usd = EXCLUDED.price_usd,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();
