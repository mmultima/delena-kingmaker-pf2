import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBackgroundImage, selectBackgroundObjectUrl } from './redux/uiSlice';

export default function PartyRelationship() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE;
  const charactersEndpoint = `${baseUrl}/characters`;
  const imageEndpoint = `${baseUrl}/image`;
  const coverImageUrl = 'https://www.enworld.org/attachments/052620_kingmakercoverart-jpg.122310/';

  const dispatch = useDispatch();
  const imageObjectUrl = useSelector(selectBackgroundObjectUrl);

  useEffect(() => {
    const fetchUrl = `${imageEndpoint}/byparam?url=${encodeURIComponent(coverImageUrl)}`;
    if (!imageObjectUrl) dispatch(fetchBackgroundImage(fetchUrl));
  }, [dispatch, imageObjectUrl, imageEndpoint]);

  const [npcCharacters, setNpcCharacters] = useState([]);
  const [pcCharacters, setPcCharacters] = useState([]);

  // toggles: include dead and include guests
  const [includeDead, setIncludeDead] = useState(false);
  const [includeGuests, setIncludeGuests] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(charactersEndpoint)
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        setNpcCharacters(data.filter(c => c.npc && c.companion));
        setPcCharacters(data.filter(c => !c.npc));
      })
      .catch(() => {
        if (mounted) {
          setNpcCharacters([]);
          setPcCharacters([]);
        }
      });
    return () => { mounted = false; };
  }, [charactersEndpoint]);

  const getRelationships = (pc, npc) => {
    if (!pc.npcRelationships) return [];
    return pc.npcRelationships.filter(rel => rel.npcId === npc.id);
  };

  const getBonus = (pc, npc) =>
    getRelationships(pc, npc).reduce((sum, rel) => sum + (rel.bonus || 0), 0);

  // apply toggles to determine which characters are visible
  const visibleNpcCharacters = npcCharacters
    .filter(n => includeDead || !n.dead)
    .filter(n => includeGuests || !n.guest);

  const visiblePcCharacters = pcCharacters
    .filter(p => includeDead || !p.dead)
    .filter(p => includeGuests || !p.guest);

  const hasGrid = visibleNpcCharacters.length > 0 && visiblePcCharacters.length > 0;

  // make number columns very compact (range -9..20), reduce first column a bit
  const firstColWidth = 110;
  const npcColumnWidth = 28;
  const gridGap = '6px';
  const gridTemplate = hasGrid
    ? `${firstColWidth}px repeat(${visibleNpcCharacters.length}, ${npcColumnWidth}px)`
    : '1fr';

  // const totalWidth = hasGrid
  //   ? firstColWidth + (visibleNpcCharacters.length * npcColumnWidth) + ((visibleNpcCharacters.length - 1) * 6)
  //   : null; //This was used because the grid always had a scrollbar. Now it is probably not needed.

  const pcNameStyle = {
    padding: '4px 6px',
    overflow: 'hidden',
    whiteSpace: 'normal',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: '-webkit-box',        // enable line-clamp
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    lineHeight: 1.15,
    maxHeight: `${Math.ceil(1.15 * 2 * 16)}px`,
    maxWidth: `${firstColWidth - 12}px`,
    textAlign: 'left'              // ensure left alignment
  };

  const numberCellStyle = {
    padding: '4px 2px',
    textAlign: 'center',
    background: 'rgba(0,0,0,0.03)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: `${npcColumnWidth}px`,
    width: `${npcColumnWidth}px`,
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '0.85rem',
    lineHeight: 1
  };

  // totals per visible NPC (sum over visible PCs)
  const npcTotals = visibleNpcCharacters.map(npc =>
    visiblePcCharacters.reduce((sum, pc) => sum + getBonus(pc, npc), 0)
  );

  // track which cell's tooltip is open (key = `${pc.id}-${npc.id}`)
  const [activeTooltip, setActiveTooltip] = useState(null);

  // close tooltip when clicking/tapping outside any tooltip cell
  useEffect(() => {
    const onDocClick = (e) => {
      if (!activeTooltip) return;
      const el = e.target;
      // if clicked element is inside the active tooltip cell, keep it
      if (el.closest && el.closest(`[data-tooltip-key="${activeTooltip}"]`)) return;
      setActiveTooltip(null);
    };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [activeTooltip]);

  // toggle tooltip on click/tap
  const handleToggleTooltip = (key) => {
    setActiveTooltip(prev => (prev === key ? null : key));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${imageObjectUrl || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        maxWidth: 720,
        // width: '100%',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 8,
        padding: '1rem',
      }}>
        <h2 style={{ textAlign: 'center', margin: '6px 0', fontSize: '1.1rem' }}>Party Relationship Totals</h2>

        {/* toggles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={includeDead}
              onChange={() => setIncludeDead(v => !v)}
            />
            Include dead
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={includeGuests}
              onChange={() => setIncludeGuests(v => !v)}
            />
            Include guests
          </label>
        </div>

        {!hasGrid && (
          <div style={{ textAlign: 'center', padding: '1.25rem 1rem', color: '#444' }}>
            No data to display.
          </div>
        )}

        {hasGrid && (
          <div style={{ overflowX: 'auto', paddingBottom: 6, margin: '0 -1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: gridTemplate,
              gap: gridGap,
              alignItems: 'stretch',
              minWidth: 'max-content'
            }}>
              <div style={{
                fontWeight: 700,
                padding: '6px 8px',
                alignSelf: 'center',
                fontSize: '0.95rem'
              }}>
                PC \ NPC
              </div>

              {visibleNpcCharacters.map(npc => (
                <div
                  key={npc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: `${npcColumnWidth + 14}px`,
                    padding: '2px',
                  }}
                >
                  <Link to={`/character/${npc.id}`} style={{ textDecoration: 'none', color: npc.dead ? '#999' : '#1976d2', display: 'inline-block' }}>
                    <div
                      style={{
                        transform: 'rotate(-90deg)',
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                        textAlign: 'center',
                        fontSize: '13px',
                        lineHeight: 1,
                        maxWidth: '160px'
                      }}
                    >
                      {npc.name}
                    </div>
                  </Link>
                </div>
              ))}

              {visiblePcCharacters.map(pc => (
                <React.Fragment key={pc.id}>
                  <div style={pcNameStyle}>
                    <Link
                      to={`/character/${pc.id}`}
                      style={{
                        textDecoration: 'none',
                        color: pc.dead ? '#999' : '#1976d2',
                        display: 'block',
                        textAlign: 'left',
                        maxWidth: '100%'
                      }}
                    >
                      {pc.name}{pc.dead ? ' (Dead)' : ''}
                    </Link>
                  </div>

                  {visibleNpcCharacters.map(npc => {
                    const rels = getRelationships(pc, npc);
                    const tooltip = rels.length
                      ? rels
                        .map(r => {
                        const line = `${r.bonus > 0 ? '+' : ''}${r.bonus}${r.description ? ` — ${r.description}` : ''}`;
                        // allow normal spaces so long lines can wrap to multiple lines
                        return line;
                        })
                        .join('\n')
                      : 'No relationships';
                    const key = `${pc.id}-${npc.id}`;

                    const isActive = activeTooltip === key;

                    return (
                      <div
                      key={npc.id}
                      data-tooltip-key={key}
                      onClick={() => handleToggleTooltip(key)}
                      style={{
                        ...numberCellStyle,
                        position: 'relative',
                        cursor: tooltip ? 'pointer' : 'default',
                        background: isActive ? 'rgba(255,152,0,0.12)' : numberCellStyle.background,
                        outline: isActive ? '2px solid #ff7043' : 'none',
                        zIndex: isActive ? 1100 : 'auto',
                        transition: 'background 120ms ease, outline 120ms ease'
                      }}
                      // keep native title for hover; click/tap shows our popup
                      title={tooltip}
                      >
                      {getBonus(pc, npc)}

                      {activeTooltip === key && (() => {
                        // compute position: horizontally center in viewport,
                        // vertically place just below the clicked cell
                        const cell = (typeof document !== 'undefined') && document.querySelector(`[data-tooltip-key="${key}"]`);
                        const rect = cell ? cell.getBoundingClientRect() : null;
                        const offset = 8; // gap between cell and tooltip
                        const maxBottomMargin = 16; // keep tooltip away from viewport bottom
                        const topPx = rect
                        ? Math.min(rect.bottom + offset, window.innerHeight - maxBottomMargin)
                        : window.innerHeight / 2;
                        const transform = rect ? 'translateX(-50%)' : 'translate(-50%, -50%)';

                        const popupStyle = {
                        position: 'fixed',
                        left: '50%',             // horizontally center
                        top: `${topPx}px`,      // below clicked object (or center fallback)
                        transform,              // translateX(-50%) or translate(-50%,-50%) fallback
                        background: 'rgba(0,0,0,0.9)',
                        color: '#fff',
                        padding: '6px 8px',
                        borderRadius: 6,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        fontSize: 12,
                        whiteSpace: 'pre-wrap',
                        zIndex: 1200,
                        maxWidth: 260,
                        width: 'min(90vw, 260px)',
                        textAlign: 'left'
                        };

                        return (
                        <div style={popupStyle}>
                          {tooltip}
                        </div>
                        );
                      })()}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}

              <div style={{ padding: '6px 8px', fontWeight: 700 }}>
                <strong>Total</strong>
              </div>
              {npcTotals.map((t, i) => (
                <div key={i} style={{
                  ...numberCellStyle,
                  background: 'rgba(0,0,0,0.04)'
                }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '0.9rem' }}>
          <Link to="/character/new" style={{
            padding: '8px 12px',
            borderRadius: 18,
            background: '#2e7d32',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>New</Link>
          <Link to="/" style={{
            padding: '8px 12px',
            borderRadius: 18,
            background: '#1976d2',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>Home</Link>
        </div>
      </div>
    </div>
  );
}